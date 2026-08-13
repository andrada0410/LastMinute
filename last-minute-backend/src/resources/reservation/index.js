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
};