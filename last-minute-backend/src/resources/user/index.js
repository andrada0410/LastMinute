const { sqlRequest } = require("../../db");

async function validateUserData(userData) {
  if (!userData.email || userData.email.length === 0) {
    const error = new Error("Trebuie sa introduceti un email valid!");
    error.status = 400;
    throw error;
  }

  if (userData.email.length > 50) {
    const error = new Error(`Emailul nu poate avea mai mult de 50 de caractere.`);
    error.status = 400;
    throw error;
  }

  if (!userData.password || userData.password.length < 6) {
    const error = new Error("Parola trebuie sa contina cel putin 6 caractere.");
    error.status = 400;
    throw error;
  }

  if (userData.password.length > 50) {
    const error = new Error(`Parola nu poate avea mai mult de 50 de caractere.`);
    error.status = 400;
    throw error;
  }
}

module.exports = {
  getUsers: async () => {
    const result = await sqlRequest().query(
      "select id, email, password, role from users",
    );
    return result.recordset;
  },

  getUserById: async (id) => {
    const result = await sqlRequest()
      .input("id", id)
      .query("select id, email, password, role from users where id = @id");
    return result.recordset;
  },

  getUserByEmail: async (email) => {
    const result = await sqlRequest().input("email", email)
      .query(`select u.id as id, u.email as email, u.password as password, ud.first_name as first_name, ud.last_name as last_name, ur.role as role, s.is_deleted as shop_is_deleted 
            from users u
            left join persons ud ON u.id = ud.user_id  
            left join user_roles ur ON ur.id = u.role
            left join shops s ON s.user_id = u.id
            where u.email = @email`);
    return result.recordset[0];
  },

  createUser: async function (userData) {
    await validateUserData(userData);

    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      const error = new Error("Emailul este deja utilizat!");
      error.status = 400;
      throw error;
    }

    try {
      const result = await sqlRequest()
        .input("email", userData.email)
        .input("password", userData.password)
        .input("role", userData.role).query(`
                SET NOCOUNT ON;
                SET XACT_ABORT ON;

                BEGIN TRANSACTION;
                DECLARE @newUserId INT;
                DECLARE @role_int INT;

                SELECT @role_int = id FROM user_roles WHERE user_roles.role = @role;

                IF @role_int IS NULL
                BEGIN
                    THROW 50001, 'Rolul specificat nu este valid sau nu există!', 1;
                END

                INSERT INTO users(email, password, role)
                VALUES (@email, @password, @role_int); 

                SET @newUserId = SCOPE_IDENTITY();
                
                SELECT
                    @newUserId as id,
                    @email as email,
                    @password as password,
                    @role as role;
                
                COMMIT TRANSACTION;
                `);

      if (!result || !result.recordset || result.recordset.length === 0) {
        const error = new Error(
          "A apărut o problemă la generarea utilizatorului în baza de date.",
        );
        error.status = 500;
        throw error;
      }

      return result.recordset[0];
    } catch (dbError) {
      if (dbError.number === 50001) {
        const error = new Error(dbError.message);
        error.status = 400;
        throw error;
      }

      throw dbError;
    }
  },

  deleteUserById: async (userId) => {
    await sqlRequest()
      .input("id", userId)
      .query(`DELETE FROM users WHERE id = @id`);
  },

  getFavoriteShopsIds: async (userId) => {
    const result = await sqlRequest().input("userId", userId).query(`
        SELECT shop_id AS shopId
        FROM favorite_shops
        WHERE user_id = @userId
      `);

    return result.recordset.map((row) => row.shopId);
  },

  addFavoriteShop: async (userId, shopId) => {
    await sqlRequest()
      .input("userId", userId)
      .input("shopId", shopId)
      .query(`
        INSERT INTO favorite_shops (user_id, shop_id)
        VALUES (@userId, @shopId);
        `);
  },

  removeFavoriteShop: async (userId, shopId) => {
    await sqlRequest()
      .input("userId", userId)
      .input("shopId", shopId)
      .query(`
        DELETE FROM favorite_shops
        WHERE user_id = @userId
        AND shop_id = @shopId;
        `)
  }
};
