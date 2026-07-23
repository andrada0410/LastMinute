const { sqlRequest } = require("../../db");

async function validateShop(shopData) {
  if (!shopData.address || shopData.address.length === 0) {
    throw new Error("Trebuie sa introduceti o adresa valida!");
  }

  if (!shopData.name || shopData.name.length === 0) {
    throw new Error("Trebuie sa introduceti un nume valid!");
  }
}

module.exports = {
  createShop: async (shopData) => {
    await validateShop(shopData);

    const result = await sqlRequest()
      .input("userId", shopData.userId)
      .input("address", shopData.address)
      .input("name", shopData.name).query(`
                INSERT INTO shops (user_id, address, name)
                OUTPUT inserted.id, inserted.user_id, inserted.address, inserted.name
                VALUES (@userId, @address, @name);
                `);

    return result.recordset[0];
  },

  getShopsInfo: async (page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    const result = await sqlRequest()
      .input("offset", offset)
      .input("limit", limit)
      .query(`SELECT s.id, s.name, s.address, u.email, COUNT(*) OVER() as totalRecords
                FROM shops s
                INNER JOIN users u ON s.user_id = u.id
                ORDER BY s.id DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY`);

    return result.recordset;
  },
};
