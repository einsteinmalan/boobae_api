var pool = require("../config/database");

module.exports = {
    calculateDistance: async (lat1, lon1, lat2, lon2) => {
  //use: calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1))
        const R = 6371; // km
        const dLat = this.toRad(lat2-lat1);
        const dLon = this.toRad(lon2-lon1);
        const flat1 = this.toRad(lat1);
        const flat2 = this.toRad(lat2);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(flat1) * Math.cos(flat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        return d;



    },

    toRad: async (Value) => {
        return Value * Math.PI / 180;
    },

    getProStatus: async user_id => {
        try {
            var result = await pool.query({
                sql: "SELECT is_pro FROM users WHERE id = ?",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    getSeenList: async author_id => {
        try {
            var result = await pool.query({
                sql:  "SELECT seens.id, seens.status_id, seens.user_id, seens.author_id,  seens.date,  users.profile_picture_url, users.is_pro,  users.username,  users.gender, users.geo_lat,users.geo_long " +
                        "FROM seens " +
                    " INNER JOIN users ON users.id = seens.user_id " +
                    " WHERE (seens.author_id = ? ) AND TIMESTAMPDIFF(HOUR,seens.date,NOW()) < 24  ORDER BY date;",
                values: [author_id]
            });
            if (result) return result;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    getUserLocation: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT geo_lat, geo_long FROM users WHERE id = ?",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },



    createSeen: async (user_id, status_id, author_id) => {
        // console.log(user,image,message)
        try {
            var result = await pool.query({
                sql:
                    "INSERT INTO seens (user_id,status_id,author_id) VALUES (?,?,?)",
                values: [user_id,status_id,author_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

    checkIfUserSeenExist: async (user_id, author_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM seens WHERE `user_id` = ? AND `author_id` = ? AND TIMESTAMPDIFF(HOUR,seens.date,NOW()) < 24 ;",
                values: [user_id,author_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },



    findOneStatus: async (id,limit) => {
        try {
            var result = await pool.query({
                sql:
                   // "SELECT * FROM statuses WHERE `user_id` = ?",
                "SELECT users.geo_lat, users.geo_long, statuses.id, statuses.user_id,  statuses.tag_id,  statuses.min_color, statuses.max_color,  statuses.image_url,  statuses.message_text, statuses.everybody_see,statuses.chat_request,statuses.show_to,  statuses.date " +
                    "FROM users " +
                    " INNER JOIN statuses ON users.id = statuses.user_id " +
                    " WHERE (users.id = ? ) AND TIMESTAMPDIFF(DAY,statuses.date,NOW()) < 2  ORDER BY statuses.date  DESC LIMIT ?;",
                values: [id,limit]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    getAllStatus: async (limit=20) => {
        try {
            var result = await pool.query({
                sql:
                // "SELECT * FROM statuses WHERE `user_id` = ?",
                    "SELECT users.id as people_id ,users.username,users.geo_lat, users.geo_long,statuses.user_id, statuses.id,   statuses.tag_id,  statuses.min_color, statuses.max_color,  statuses.image_url,  statuses.message_text, statuses.everybody_see,statuses.chat_request,statuses.show_to,  statuses.date " +
                    " FROM users " +
                    " INNER JOIN statuses ON users.id = statuses.user_id " +
                    " WHERE TIMESTAMPDIFF(HOUR,statuses.date,NOW()) < 24  ORDER BY statuses.date  DESC LIMIT ?  ;",
                values: [limit]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    allSeenCount: async (user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT COUNT(*) as viewers FROM seens WHERE `author_id` = ? AND TIMESTAMPDIFF(HOUR,seens.date,NOW()) < 24 ;",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    getAllFromUserStatus: async (user_id) => {
        try {
            var result = await pool.query({
                sql:
                    "SELECT * FROM statuses WHERE `user_id` = ?",
                values: [user_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    findOneFromUserStatus: async (id,user_id) => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM statuses WHERE `user_id` = ? AND `id` = ? ;",
                values: [user_id,id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    deleteOneStatus: async (id,user_id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM statuses WHERE `id` = ? and `user_id` = ?",
                values: [id, user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },


    deleteOneFromUserStatus: async (id, user_id) => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM statuses WHERE `user_id` = ? AND `id` = ?",
                values: [user_id,id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },

   /* deleteAllFromUserStatus: async user_id => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM statuses WHERE user_id = ?",
                values: [user_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    },*/

    getAllSeenFromStatus: async status_id => {
        try {
            var result = await pool.query({
                sql: "SELECT * FROM seens WHERE status_id = ? ",
                values: [status_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    deleteAllSeenFromStatus: async status_id => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM seens WHERE status_id = ? ",
                values: [status_id]
            });
            if (result) return result;
        } catch (err) {
            throw new Error(err);
        }
    },

    //CRON PURGES OF EXPIRED STATUS

    deleteAllExpiredSeen: async () => {
        try {
            var result = await pool.query({
                sql: "DELETE FROM seens WHERE TIMESTAMPDIFF(HOUR,statuses.date,NOW()) > 24 ;",
                values: [author_id]
            });
            return result.affectedRows;
        } catch (err) {
            throw new Error(err);
        }
    }






};
