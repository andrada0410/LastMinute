const { sqlRequest } = require('../../db');

module.exports = {
associatePersonToUser: async (userData) => {
        const result = await sqlRequest()
        .input('id', userData.id)
        .input('first_name', userData.firstName)
        .input('last_name', userData.lastName)
        .query(`
                INSERT INTO persons (user_id, first_name, last_name)
                VALUES (@id, @first_name, @last_name)
            `);

        if (!result.rowsAffected || result.rowsAffected[0] === 0) {
            const err = new Error("An error occured while associating user details.");
            err.status = 500;
            throw err;
        }

        return true;
    }
}