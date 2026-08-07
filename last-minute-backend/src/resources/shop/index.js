const { sqlRequest } = require("../../db");
const fs = require("fs/promises");
const path = require("node:path");
const config = require("../../../config.json");

async function validateShop(shopData) {
  if (!shopData.address || shopData.address.length === 0) {
    throw new Error("Trebuie sa introduceti o adresa valida!");
  }

  if (!shopData.name || shopData.name.length === 0) {
    throw new Error("Trebuie sa introduceti un nume valid!");
  }
}

module.exports = {
  getShopById: async (id) => {
    const result = await sqlRequest()
      .input("id", id)
      .query(
        `select s.id, s.name, s.address, s.user_id, s.logo_path as logoPath, s.banner_path as bannerPath, s.details, c.id AS categoryId, c.name AS categoryName
         from shops s
         left join categories c on c.id = s.category_id
         where s.id = @id`,
      );
    return result.recordset[0];
  },

  getShopByUser: async (userId) => {
    const result = await sqlRequest().input("user_id", userId)
      .query(`select s.id, s.name, s.address, s.user_id, s.logo_path as logoPath, s.banner_path as bannerPath, s.details, c.id AS categoryId, c.name AS categoryName
             from shops s
             left join categories c on c.id = s.category_id
             where s.user_id=@user_id`);
    return result.recordset[0];
  },

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

  getShopsInfo: async (options = {}) => {
    const { page = 1, limit = 5, email = null } = options;
    const offset = (page - 1) * limit;

    const request = sqlRequest().input("offset", offset).input("limit", limit);

    let emailFilter = "";
    if (email) {
      request.input("email", `%${email}%`);
      emailFilter = "AND u.email LIKE @email";
    }

    const result = await request.query(`
                SELECT s.id, s.name, s.address, u.email, COUNT(*) OVER() as totalRecords
                FROM shops s
                INNER JOIN users u ON s.user_id = u.id
                WHERE s.is_deleted = 0 ${emailFilter}
                ORDER BY s.id DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY`);

    return result.recordset;
  },

  updateShop: async (id, shopData) => {
    if (shopData.name !== undefined || shopData.address !== undefined) {
      await validateShop({
        name: shopData.name,
        address: shopData.address,
      });
    }

    const currentShopResult = await sqlRequest()
      .input("id", id)
      .query(
        "SELECT logo_path AS logoPath, banner_path AS bannerPath FROM shops WHERE id = @id AND is_deleted = 0",
      );

    if (currentShopResult.recordset.length === 0) {
      const err = new Error("Magazinul nu a fost gasit.");
      err.status = 404;
      throw err;
    }

    const currentShopData = currentShopResult.recordset[0];
    let filesToDelete = [];

    let updateCommands = [];
    let request = sqlRequest().input("id", id);

    if (shopData.categoryId !== undefined) {
      updateCommands.push("category_id = @categoryId");
      request.input("categoryId", shopData.categoryId);
    }

    if (shopData.address !== undefined) {
      updateCommands.push("address = @address");
      request.input("address", shopData.address);
    }

    if (shopData.name !== undefined) {
      updateCommands.push("name = @name");
      request.input("name", shopData.name);
    }

    if (shopData.details !== undefined) {
      updateCommands.push("details = @details");
      request.input("details", shopData.details);
    }

    if (shopData.logo && shopData.logo.length > 0) {
      const logoName = shopData.logo[0].filename;
      updateCommands.push("logo_path = @logo");
      request.input("logo", logoName);

      if (currentShopData.logoPath) {
        filesToDelete.push(
          path.join(
            process.cwd(),
            config.imagesFolder,
            currentShopData.logoPath,
          ),
        );
      }
    }

    if (shopData.banner && shopData.banner.length > 0) {
      const bannerName = shopData.banner[0].filename;
      updateCommands.push("banner_path = @banner");
      request.input("banner", bannerName);

      if (currentShopData.bannerPath) {
        filesToDelete.push(
          path.join(
            process.cwd(),
            config.imagesFolder,
            currentShopData.bannerPath,
          ),
        );
      }
    }

    if (updateCommands.length === 0) {
      return currentShopData;
    }

    const updateQuery = `
      UPDATE shops
      SET ${updateCommands.join(", ")}
      OUTPUT inserted.id, inserted.user_id AS userId, inserted.address, inserted.name, inserted.details, 
      inserted.logo_path AS logoPath, inserted.banner_path AS bannerPath, inserted.category_id AS categoryId
      WHERE id = @id AND is_deleted = 0;
    `;

    const result = await request.query(updateQuery);

    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Nu s-a putut șterge fișierul:", filePath, err);
      }
    }

    return result.recordset[0];
  },

  deleteShop: async (id) => {
    const result = await sqlRequest().input("id", id).query(`
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
      .input("userId", userId)
      .query(`SELECT id, is_deleted FROM shops WHERE user_id = @userId`);

    return result.recordset[0];
  },

  getShopsForMap: async (filter) => {
    let query = `SELECT
                    s.id,
                    s.name,
                    s.address,
                    s.has_offers as hasOffers,
                    s.coordinates.Lat as lat,
                    s.coordinates.Long as lon,
                    s.logo_path as logoPath,
                    c.name as category
                FROM shops s
                LEFT JOIN categories c ON s.category_id = c.id
                WHERE s.is_deleted = 0`;

    const request = sqlRequest();

    if (filter && filter.categoryId && filter.categoryId.length > 0) {
      const paramNames = filter.categoryId.map((_, index) => `@cat${index}`);
      query += ` AND s.category_id IN (${paramNames.join(", ")})`;

      filter.categoryId.forEach((id, index) => {
        request.input(`cat${index}`, id);
      });
    }

    query += ` ORDER BY s.id`;

    const result = await request.query(query);

    const optimizedShops = result.recordset.map((row) => {
      const shop = {
        id: row.id,
        name: row.name,
        address: row.address,
        hasOffers: row.hasOffers,
      };

      if (row.lat != null && row.lon != null) {
        shop.lat = row.lat;
        shop.lon = row.lon;
      }

      if (row.logoPath != null) {
        shop.logoPath = row.logoPath;
      }

      if (row.category != null) {
        shop.category = row.category;
      }

      return shop;
    });

    return optimizedShops;
  },

  updateShopCoordinates: async (shopId, lat, lon) => {
    try {
      const result = await sqlRequest()
        .input("id", shopId)
        .input("lat", lat)
        .input("lon", lon).query(`
              UPDATE shops
              SET coordinates = geography::Point(@lat, @lon, 4326)
              WHERE id = @id AND is_deleted = 0;
          `);

      if (result.rowsAffected[0] === 0) {
        const error = new Error(
          "Magazinul cu id-ul specificat nu a fost găsit în baza de date.",
        );
        error.status = 404;
        throw error;
      }

      return true;
    } catch (error) {
      if (error.status) {
        // if the error is not thrown directly by the DB, it is thrown further as it is
        throw error;
      }

      const dbError = new Error(
        `Eroare critică la actualizarea coordonatelor pentru magazinul ${shopId}: ${error.message}`,
      );
      dbError.status = 500;
      throw dbError;
    }
  },

  resetShopCoordinates: async (shopId) => {
    try {
      const result = await sqlRequest().input("id", shopId).query(`
                    UPDATE shops
                    SET coordinates = NULL
                    WHERE id = @id AND is_deleted = 0;
                `);

      if (result.rowsAffected[0] === 0) {
        const error = new Error(
          "Magazinul cu id-ul specificat nu a fost găsit pentru resetare.",
        );
        error.status = 404;
        throw error;
      }

      return true;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      const dbError = new Error(
        `Eroare la resetarea coordonatelor pentru magazinul ${shopId}: ${error.message}`,
      );
      dbError.status = 500;
      throw dbError;
    }
  },
};
