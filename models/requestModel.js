var pool = require("../config/database");

module.exports = {

    createRequest: async (user_id, target_id) => {
        // console.log(user,image,message)
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO requests (user_id,target_id) VALUES (?,?)",
                values: [user_id,target_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    checkIfRequestExist: async (user_id) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT COUNT(*) FROM requests WHERE `user_id` = ? ",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    findUserRequest: async (user_id,target_id) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM requests WHERE `user_id` = ? AND `target_id` = ?",
                values: [user_id,target_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },


    findTotalUserRequest: async (user_id) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT COUNT(*) FROM requests WHERE `user_id` = ? ",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },


    deleteAllRequestFromUser: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM requests WHERE `user_id` = ?",
                values: [user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },


    checkRequestTimeElapsed: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT TIMESTAMPDIFF(HOUR,(SELECT date FROM requests WHERE user_id = ? ORDER BY date DESC LIMIT 1),NOW()) duration",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },




};
