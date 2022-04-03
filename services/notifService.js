var notifModel = require("../models/notifModel");
var userModel = require("../models/userModel");
var chatModel = require("../models/chatModel");
var chatController = require("../controllers/chatController");

module.exports = {
    visit: async (user_id, target_id, username) => {
        if (user_id == target_id)
          return false;
        var visited = await notifModel.alreadyExists('visit', user_id, target_id);
        if (!visited)
        {
          await notifModel.addOne([target_id, user_id, username, 3, "just viewed your profile!"]);
          var score = await userModel.getUserScore(target_id);
          score = score[0].pop_score;
          if (score < 996)
            await userModel.increaseScore(5, target_id);
          return true;
        }
        return false;
    },

    like: async (user_id, target_id, username) => {
        await notifModel.deleteOne(target_id, user_id, 4);
        await notifModel.deleteOne(target_id, user_id, 1);
        await notifModel.addOne([target_id, user_id, username, 1, "just sent  you a chat request"]);
        var score = await userModel.getUserScore(target_id);
        score = score[0].pop_score;
        if (score < 991)
          await userModel.increaseScore(10, target_id);
    },

    dislike: async (user_id, target_id, username) => {
        await notifModel.deleteOne(target_id, user_id, 1);
        await notifModel.deleteOne(target_id, user_id, 4);
        await notifModel.deleteOne(target_id, user_id, 5);
        await notifModel.addOne([target_id, user_id, username, 4, "just cancelled a chat request sent!"]);
        var score = await userModel.getUserScore(target_id);
        score = score[0].pop_score;
        if (score > 9)
          await userModel.decreaseScore(10, target_id);
        else
          await userModel.resetUserScore(target_id);
    },

    like_back: async (user_id, target_id, username) => {
        await notifModel.deleteOne(target_id, user_id, 4);
        await notifModel.addOne([target_id, user_id, username, 5, "just accepted your chat request."]);
        var score = await userModel.getUserScore(target_id);
        score = score[0].pop_score;
        if (score < 991)
            await userModel.increaseScore(10, target_id);
        else
            await userModel.increaseScore((1000 - score), target_id);
         var exist = await chatModel.alreadyExists(user_id, target_id);
        if (exist == false) {
              var room_id = await chatController.createChatRoom(user_id, target_id, username);
        }
    }

}
