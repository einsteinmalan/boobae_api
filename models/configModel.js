var pool = require("../config/database");

module.exports = {

    createConfig: async (name, value) => {
        // console.log(user,image,message)
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO configurations (name,value) VALUES (?,?)",
                values: [name,value]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },



    findOneConfig: async (name) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM configurations WHERE `name` LIKE %?%",
                values: [name]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },



    selectAllConfig: async () => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM configurations",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },


    updateConfig: async (id,value) => {
        // console.log(user,image,message)
        try {
            var result = await pool.query({
                sql:
                    "UPDATE configurations SET value = ? WHERE id = ?",
                values: [value,id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },




};
