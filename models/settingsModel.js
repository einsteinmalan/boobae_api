var pool = require("../config/database");

module.exports = {

    createSettings: async (user_id) => {
       // console.log(user,image,message)
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO settings (user_id) VALUES (?)",
                values: [user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    findOneSettings: async id => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM settings WHERE `id` = ?",
                values: [id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },


    findUserSettings: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM settings WHERE `user_id` = ? ",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    deleteOneSettings: async (id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM settings WHERE `id` = ?",
                values: [id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },


    deleteUserSettings: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM settings WHERE `user_id` = ?",
                values: [user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },




    updateOneSettings: async (user_id, field, data) => {
        try {
            var result = await pool.query({
                sql: "UPDATE settings SET ?? = ? WHERE `user_id` = ?",
                values: [field, data, user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },




};
