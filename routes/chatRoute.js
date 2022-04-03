var express = require("express");
var chatController = require("../controllers/chatController");

exports.router = (() => {
  var chatRouter = express.Router();

  chatRouter.route('/room/:room_id').get(chatController.getMessages);
  chatRouter.route('/matches/list').post(chatController.getMatchList); //'/matches/:token'
  chatRouter.route('/notification/list/:userID').get(chatController.getListNotification);
  chatRouter.route('/notification/messages/count').post(chatController.getCountMsgNotification);
  chatRouter.route('/create-chat').post(chatController.createChatRoom);
  chatRouter.route('/chat/last-message').post(chatController.createChatRoom);


  return chatRouter;
})();
