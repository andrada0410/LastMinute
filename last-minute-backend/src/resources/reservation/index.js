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