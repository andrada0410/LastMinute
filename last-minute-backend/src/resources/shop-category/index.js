const { sqlRequest } = require("../../db")

module.exports = {
    getAll: async () => {
        const result = await sqlRequest().query('select id, name from categories');
        return result.recordset;
    },
}