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
                WHERE s.is_deleted = 0
                ORDER BY s.id DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY`);

        return result.recordset;
    },

    updateShop: async (id, name, address) => {
    await validateShop({name, address});

    const result = await sqlRequest()
        .input('id', id)
        .input('address', address)
        .input('name', name)
        .query(`
            UPDATE shops
            SET address = @address, name = @name
            OUTPUT inserted.id, inserted.user_id, inserted.address, inserted.name
            WHERE id = @id AND is_deleted = 0;
            `);

    if (result.recordset.length === 0) {
        const err = new Error("Magazinul nu a fost gasit.");
        err.status = 404;
        throw err;
    }

    return result.recordset[0];
  },

    deleteShop: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query(`
                UPDATE shops
                SET is_deleted = 1
                OUTPUT inserted.id
                WHERE id = @id AND is_deleted = 0;
                `);

        if (result.recordset.length === 0) {
            const err = new Error("Magazinul nu a fost gasit.");
            err.status = 404;
            throw err;
        }

        return result.recordset[0];
    },

    getShopByUserId: async (userId) => {
        const result = await sqlRequest()
            .input('userId', userId)
            .query(`SELECT id, is_deleted FROM shops WHERE user_id = @userId`);
        
        return result.recordset[0];
    },
}
