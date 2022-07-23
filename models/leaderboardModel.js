var pool = require("../config/database");

module.exports = {

    checkLeaderboardExist: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM leaderboards WHERE `user_id` = ? ",
                values: [user_id]
            });
            return result.length > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    createLeaderboardRecord: async (user_id,copper,silver,gold) => {
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO leaderboards (user_id,copper_medal,silver_medal,gold_medal) VALUES (?,?,?,?)",
                values: [user_id,copper,silver,gold ]
            });
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },
    getUserLeaderboard: async user_id => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM leaderboards WHERE user_id = ?",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    getAllLeaderboard: async () => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM leaderboards ",
                values: []
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    deleteUserLeaderboard: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM leaderboards WHERE user_id = ?",
                values: [user_id]
            });
          //  return result.affectedRows;
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    updateOneLeaderboard: async (field_two, field, data,data_two) => {
        try {
            var result = await pool.query({
                sql: "UPDATE leaderboards SET ?? = ? WHERE ?? = ?",
                values: [field, data, field_two,data_two]
            });
            if (result) return true;
        } catch (err) {
            throw new Error(err);
        }
    },


    increaseSilver: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "UPDATE leaderboards SET silver_medal = silver_medal + 1 WHERE `user_id` = ?",
                values: [user_id]
            });
          //  return result.affectedRows;
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    increaseCopper: async ( user_id) => {
        try {
            var result = await pool.query({
                sql: "UPDATE leaderboards SET copper_medal = copper_medal + 1 WHERE `user_id`= ?",
                values: [user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    increaseGold: async ( user_id) => {
        try {
            var result = await pool.query({
                sql: "UPDATE leaderboards SET gold_medal = gold_medal + 1 WHERE `user_id`= ?",
                values: [ user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    //---> #Medla:   Get specific Medal

    getMedal: async (user_id,field) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT ? FROM leaderboards WHERE user_id = ?",
                values: [field,user_id]
            });
            if (result) console.log(`result: ${result.data}`);
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },


    //------------------------------------

    checkRankExist: async user_id => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM ranks WHERE `user_id` = ?",
                values: [user_id]
            });
            return result.length > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    createRankRecord: async (user_id,leaderboard_id,total_points) => {
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO ranks (user_id, leaderboard_id, total_points ) VALUES (?,?,?)",
                values: [user_id,leaderboard_id,total_points]
            });
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    deleteUserRanks: async user_id => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM ranks WHERE `user_id` = ?",
                values: [user_id]
            });
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    deleteAnyRanks: async id => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM ranks WHERE `id` = ?",
                values: [id]
            });
            return result.affectedRows > 0;

        } catch (err) {
            throw new Error(err);
        }
    },

    updateRank: async (user_id, points) => {
        try {
            var result = await pool.query({
                sql:
                    "UPDATE ranks SET `total_points`= ?  WHERE `user_id`= ?",
                values: [points,user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    getRanksBySex: async (g1, range, uid, days) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT users.id, users.username,users.gender, users.profile_picture_url, users.geo_lat, users.geo_long,users.account_type,ranks.total_points , ranks.leaderboard_id,leaderboards.silver_medal as silver,leaderboards.copper_medal as copper,leaderboards.gold_medal as gold, TIMESTAMPDIFF(DAY,ranks.date,NOW()) as day " + //, settings.disable_account,
                    "FROM users" +
                    " INNER JOIN ranks ON users.id = ranks.user_id INNER JOIN leaderboards ON ranks.leaderboard_id = leaderboards.id" +  // INNER JOIN settings ON ranks.user_id = settings.user_id
                    " WHERE (users.gender = ? ) AND (users.geo_lat BETWEEN ? AND ?) AND (users.geo_long BETWEEN ? AND ?) AND users.id NOT IN (SELECT user_id FROM block WHERE blocking_id = ?) AND TIMESTAMPDIFF(DAY,ranks.date,NOW()) < ?  ORDER BY ranks.total_points  DESC LIMIT 53;",
                values: [
                    g1,
                    range[0],
                    range[1],
                    range[2],
                    range[3],
                    uid,
                    days
                ]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },



    getAllRanks: async num_days => {


        try {
            return await pool.query({
                sql: "SELECT id,user_id, leaderboard_id, total_points, TIMESTAMPDIFF(DAY,date,NOW()) days FROM ranks WHERE days < ? ORDER BY total_points  DESC",
                values: [num_days]
            });
        } catch (err) {
            throw new Error(err);
        }
    },






};
