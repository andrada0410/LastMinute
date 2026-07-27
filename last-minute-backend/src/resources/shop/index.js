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


    getShopsForMap: async () => {
        const result = await sqlRequest()
        .query(`SELECT
                    id,
                    name,
                    address,
                    has_offers as hasOffers,
                    coordinates.Lat as lat,
                    coordinates.Long as lon
                FROM shops
                WHERE is_deleted = 0
                ORDER BY id`);

        const optimizedShops = result.recordset.map(row => {
            const shop = {
                id: row.id,
                name: row.name,
                address: row.address,
                hasOffers: row.hasOffers
            };

            if (row.lat != null && row.lon != null) {
                shop.lat = row.lat;
                shop.lon = row.lon;
            }

            return shop;
        });

        return optimizedShops;
    },

    updateShopCoordinates: async (shopId, lat, lon) => {
      try {
        const result = await sqlRequest()
          .input('id', shopId)
          .input('lat', lat)
          .input('lon', lon)
          .query(`
              UPDATE shops
              SET coordinates = geography::Point(@lat, @lon, 4326)
              WHERE id = @id AND is_deleted = 0;
          `);

          if (result.rowsAffected[0] === 0) {
            const error = new Error("Magazinul cu id-ul specificat nu a fost găsit în baza de date.");
            error.status = 404;
            throw error;
          }

          return true;
        } catch (error) {
          if (error.status) { // if the error is not thrown directly by the DB, it is thrown further as it is
            throw error;
          }

          const dbError = new Error(`Eroare critică la actualizarea coordonatelor pentru magazinul ${shopId}: ${error.message}`);
          dbError.status = 500;
          throw dbError;
        } 
    },

    resetShopCoordinates: async (shopId) => {
        try {
            const result = await sqlRequest()
                .input('id', shopId)
                .query(`
                    UPDATE shops
                    SET coordinates = NULL
                    WHERE id = @id AND is_deleted = 0;
                `);

            if (result.rowsAffected[0] === 0) {
                const error = new Error("Magazinul cu id-ul specificat nu a fost găsit pentru resetare.");
                error.status = 404;
                throw error;
            }

            return true;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            const dbError = new Error(`Eroare la resetarea coordonatelor pentru magazinul ${shopId}: ${error.message}`);
            dbError.status = 500;
            throw dbError;
        }
    },
}
