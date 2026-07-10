const { sqlRequest } = require('../../db');
module.exports = {
    get: async () => {
        const result = await sqlRequest().query('select * from example');
        return result.recordset;
    },

    getById: async (id) => {
        const result = await sqlRequest()
            .input('id', id)
            .query('select * from example where id = @id');
        return result.recordset;
    }
}