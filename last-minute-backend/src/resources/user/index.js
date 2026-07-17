const { sqlRequest } = require('../../db');

module.exports = {
    getUsers: async () => {
        const result = await sqlRequest().query('select id, email, password, first_name, last_name from users');
        return result.recordset;
    },

    getUserById: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query('select id, email, password, first_name, last_name from users where id = @id');
        return result.recordset;
    },

    getUserByEmail: async (email) => {
        const result = await sqlRequest()
        .input('email', email)
        .query('select id, email, password, first_name, last_name from users where email = @email');
        return result.recordset;
    },

    createUser: async (userData) => {
        const result = await sqlRequest()
            .input('email', userData.email)
            .input('password', userData.password)
            .input('first_name', userData.firstName)
            .input('last_name', userData.lastName)
            .query(`
                INSERT INTO users(email, password, first_name, last_name)
                OUTPUT inserted.id, inserted.email, inserted.password, inserted.first_name, inserted.last_name
                VALUES (@email, @password, @first_name, @last_name)`
            );

        return result.recordset[0];
    }
};