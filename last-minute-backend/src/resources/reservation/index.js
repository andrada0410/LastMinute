const { sqlRequest } = require("../../db");

async function validateReservation(reservationData) {
    if (!reservationData.userId) {
        throw new Error("Id-ul utilizatorului este obligatoriu!");
    }

    if (!reservationData.offerId) {
        throw new Error("Id-ul ofertei este obligatoriu!");
    }

    if (!reservationData.productId) {
        throw new Error("Id-ul produsului este obligatoriu!");
    }

    if (reservationData.quantity === undefined || reservationData.quantity <= 0) {
        throw new Error("Cantiatea trebuie să fie mai mare decât 0!");
    }

    if (reservationData.unitPrice === undefined || reservationData.unitPrice < 0) {
        throw new Error("Prețul per bucată este invalid!");
    }

    if (reservationData.totalPrice === undefined || reservationData.totalPrice < 0) {
        throw new Error("Prețul total este invalid!");
    }
}

async function expireOverdueReservations() {
  await sqlRequest().query(`
        SET XACT_ABORT ON;
        BEGIN TRANSACTION;
 
        DECLARE @expired TABLE (
            offer_id INT,
            product_id INT,
            quantity INT
        );
 
        UPDATE r
        SET r.status = 'CANCELLED'
        OUTPUT INSERTED.offer_id, INSERTED.product_id, INSERTED.quantity INTO @expired
        FROM reservations r
        INNER JOIN offers o ON r.offer_id = o.id
        WHERE r.status = 'PENDING' AND o.end_date < GETDATE();
 
        UPDATE op
        SET op.quantity = op.quantity + e.quantity
        FROM offers_products op
        INNER JOIN @expired e ON op.offer_id = e.offer_id AND op.product_id = e.product_id;
 
        COMMIT TRANSACTION;
        `);
}

module.exports = {
  createReservation: async function (reservationData) {
    await validateReservation(reservationData);

    const { userId, offerId, productId, quantity, unitPrice, totalPrice } =
      reservationData;

    const result = await sqlRequest()
      .input("userId", userId)
      .input("offerId", offerId)
      .input("productId", productId)
      .input("quantity", quantity)
      .input("unitPrice", unitPrice)
      .input("totalPrice", totalPrice)
      .query(`
            INSERT INTO reservations (user_id, offer_id, product_id, quantity, unit_price, total_price)
            OUTPUT INSERTED.*
            VALUES (@userId, @offerId, @productId, @quantity, @unitPrice, @totalPrice)
            `);

    return result.recordset[0];
  },

  getReservationsByShop: async function (shopId, status) {
    await expireOverdueReservations();
    
    const request = sqlRequest().input("shopId", shopId);
 
    let statusFilter = "";
    if (status) {
      request.input("status", status);
      statusFilter = "AND r.status = @status";
    }
 
    const result = await request.query(`
            SELECT
                r.id AS id,
                r.offer_id AS offerId,
                r.product_id AS productId,
                p.name AS productName,
                p.photo_path AS productImage,
                r.quantity AS quantity,
                r.unit_price AS unitPrice,
                r.total_price AS totalPrice,
                o.start_date AS pickupStart,
                o.end_date AS pickupEnd,
                CONCAT(per.first_name, ' ', per.last_name) AS customerName,
                r.status AS status,
                r.created_at AS createdAt
            FROM reservations r
            INNER JOIN offers o ON r.offer_id = o.id
            INNER JOIN products p ON r.product_id = p.id
            INNER JOIN users u ON r.user_id = u.id
            LEFT JOIN persons per ON per.user_id = u.id
            WHERE o.shop_id = @shopId
            ${statusFilter}
            ORDER BY r.created_at DESC
            `);
 
    return result.recordset;
  },

  confirmReservation: async function (reservationId, shopId) {
    const result = await sqlRequest()
      .input("id", reservationId)
      .input("shopId", shopId)
      .query(`
            UPDATE r
            SET r.status = 'COMPLETED'
            OUTPUT INSERTED.*
            FROM reservations r
            INNER JOIN offers o ON r.offer_id = o.id
            WHERE r.id = @id AND r.status = 'PENDING' AND o.shop_id = @shopId
            `);
 
    if (result.recordset.length === 0) {
      throw new Error("Rezervarea nu a fost găsită sau nu mai este în așteptare.");
    }
 
    return result.recordset[0];
  },
 
  cancelReservation: async function (reservationId, shopId) {
    const result = await sqlRequest()
      .input("id", reservationId)
      .input("shopId", shopId)
      .query(`
            SET XACT_ABORT ON;
            BEGIN TRANSACTION;
 
            DECLARE @cancelled TABLE (
                id INT,
                user_id INT,
                offer_id INT,
                product_id INT,
                quantity INT,
                unit_price DECIMAL(10, 2),
                total_price DECIMAL(10, 2),
                status NVARCHAR(30),
                created_at DATETIME
            );
 
            UPDATE r
            SET r.status = 'CANCELLED'
            OUTPUT INSERTED.* INTO @cancelled
            FROM reservations r
            INNER JOIN offers o ON r.offer_id = o.id
            WHERE r.id = @id AND r.status = 'PENDING' AND o.shop_id = @shopId;
 
            UPDATE op
            SET op.quantity = op.quantity + c.quantity
            FROM offers_products op
            INNER JOIN @cancelled c ON op.offer_id = c.offer_id AND op.product_id = c.product_id;
 
            COMMIT TRANSACTION;
 
            SELECT * FROM @cancelled;
            `);
 
    if (result.recordset.length === 0) {
      throw new Error("Rezervarea nu a fost găsită sau nu mai este în așteptare.");
    }
 
    return result.recordset[0];
  },

    getReservationsByUser: async (id) => {
        const result = await sqlRequest()
            .input("userId", id)
            .query(`
            SELECT
                r.id,
                r.offer_id AS offerId,
                r.product_id AS productId,
                r.quantity,
                r.unit_price AS unitPrice,
                r.total_price AS totalPrice,
                r.status,
                r.created_at AS createdAt,
                p.name AS productName,
                p.photo_path AS productPhotoPath,
                s.name AS shopName,
                o.start_date AS pickupStartTime,
                o.end_date AS pickupEndTime
            FROM reservations r
            INNER JOIN products p ON p.id = r.product_id
            INNER JOIN offers o ON o.id = r.offer_id
            INNER JOIN shops s ON s.id = o.shop_id
            WHERE r.user_id = @userId
            ORDER BY r.created_at DESC
            `);

        return result.recordset;
    },
};