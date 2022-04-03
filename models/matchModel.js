var pool = require("../config/database");

module.exports = {
  getMatchList: async userID => {
    try {
      var result = await pool.query({
        sql:
        //"SELECT * FROM matches WHERE user_1 = ? OR user_2 = ? ORDER BY last_message DESC",
            "SELECT matches.id, matches.room_id, matches.user_1, matches.user_2, matches.username_1, matches.username_2, matches.last_message, matches.date, users.profile_picture_url " +
            "FROM matches" +
            " INNER JOIN users ON users.id = matches.user_1 " +
            " WHERE matches.user_1 = ? OR matches.user_2 = ? ORDER BY last_message DESC;",
        values: [userID, userID]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },

  updateNbMsg: async roomID => {
    try {
      var result = await pool.query({
        sql: "UPDATE matches SET last_message = NOW() WHERE room_id = ?",
        values: [roomID]
      });
      //console.log(result);
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
