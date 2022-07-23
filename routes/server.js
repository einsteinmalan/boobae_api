/*let app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io").listen(http);*/

var cron = require('node-cron');

//===============================================
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);




//============================================

let bodyParser = require("body-parser");
let userRoute = require("./userRoute");
var chatRoute = require("./chatRoute");
var mainRoute = require("../routes/mainRoute");
var socialRoute = require("../routes/socialRoute");
var chatController = require("../controllers/chatController");
var userController = require("../controllers/userController");
var userModel = require("../models/userModel");
var Seed = require("../config/seed");
const statusLeaderboard = require("../models/leaderboardModel");
const mainService = require("../services/mainService");

/* Schedule task   */
 cron.schedule('* * * * *', async function ()   {
  console.log('running a task every minute');
  var result = await statusLeaderboard.getAllLeaderboard();
  if(result){
 //  console.log(result);
    result.forEach(async function (value){
    //  console.log("UserID: " + user_id);
      var user_id = value["user_id"];
      var leaderboard_id = value["id"];

      var isRankExist = await statusLeaderboard.checkRankExist(user_id);
      console.log("Rank check: " + isRankExist);
      if(isRankExist){
        console.log("Rank Exist");

        var silver = value["silver_medal"] ;
        var copper =value["copper_medal"] ;
        var gold = value["gold_medal"];

        console.log("silverPts :" + silver);
        console.log("copperPts :" + copper);
        console.log("goldPts :" + gold);

        var totalPoint = (silver * 50) + (copper * 1) + (gold * 100);
       // console.log("Total Points calculated: "+totalPoint);

       var ops =  await statusLeaderboard.updateRank(user_id,totalPoint);


        if (ops.error) console.log("ERROR Updating rank (User_ID)=> "+ user_id + "\n" + ops.error);
       // else console.log("Rank updated successfully!" + ops);

      }else{
        console.log("Rank Does NOT Exist");

        var silver = value["silver_medal"] ;
        var copper =value["copper_medal"] ;
        var gold = value["gold_medal"];

      //  console.log("silverPts :" + silver);
      //  console.log("copperPts :" + copper);
      //  console.log("goldPts :" + gold);

        var totalPoint = (silver * 50) + (copper * 1) + (gold * 100);
       // console.log("Total Points calculated: "+totalPoint);

        var result = await statusLeaderboard.createRankRecord(user_id,leaderboard_id,totalPoint);

        if (result.error) console.log("ERROR Creating Rank => "+ result.error);
       // else console.log("Rank create successfully!" + result);
      }




    })

  }else console.log("Error fetching leaderboard");


});


cron.schedule('* * * * *', async function ()   {
  console.log('running a task every minute - checking user pro status');
  var result = await userModel.getAllTrialProsers();
  console.log(`result: ${result}`);

  if(result.length > 0){
    result.forEach(async function (value){
      var user_id = value["id"];
      var isPro = value["is_pro"];
      var username = value["username"];
      var date = value["subscription_date"];
      var type = value["subscription_package"];

        var res = await userModel.checkExpiredProStatus(user_id);
        var resp = res[0]["elapsed"];
       // console.log(`ELAPSED: ${res[0]["elapsed"]}`)
      console.log(`ELAPSED: ${resp}`)
      if(resp > 15){  //change to 15
        console.log(`removing ${username} PRO status`);
      var ops =  await userModel.updateRemovePro(user_id);
      console.log(`ops done! ${ops}`);
      }

    } )
  }

});


/*#check all expired subscription*/
cron.schedule('0 */6 * * *', async function ()   {
  console.log('running a task every 6 hours - checking user pro status - Monthly subscription mostly');
  var result = await userModel.getAllProUsers();
 // console.log(`result: ${result}`);

  if(result.length > 0){
    result.forEach(async function (value){
      var user_id = value["id"];
      var isPro = value["is_pro"];
      var username = value["username"];
      var date = value["subscription_date"];
      var typeSubs = value["subscription_package"];

      var res = await userModel.checkExpiredProStatusInDays(user_id);
      var elapsed = res[0]["elapsed"];
      // console.log(`ELAPSED: ${res[0]["elapsed"]}`)
      console.log(`ELAPSED: ${resp}`)

      if(typeSubs === "monthly"){
        if(elapsed > 31){  //time for subscription
          var ops =  await userModel.updateRemovePro(user_id);
        }
      } else if(typeSubs === "trimestrial"){
        if(elapsed > 93){  //time for subscription
          var ops =  await userModel.updateRemovePro(user_id);
        }
      }else if(typeSubs === "semestrial"){
        if(elapsed > 186){  //time for subscription
          var ops =  await userModel.updateRemovePro(user_id);
        }
      }else if(typeSubs === "annual"){
        if(elapsed > 366){  //time for subscription
          var ops =  await userModel.updateRemovePro(user_id);
        }
      }



    } )
  }


});


/* End of scheduled task  */

/* Listenning port */

//const PORT = 3000;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*http.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});*/

/* Middlewares */
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/users/", userRoute.router);
app.use("/chat/", chatRoute.router);
app.use("/main/", mainRoute.router);
app.use("/social/",socialRoute.router);
//app.use('/mypicture', express.static('user_image'));

app.get("/seed", (req, res) => {
  Seed.getUserSeed();
  res.send({ message: "Database created succefully" });
});
app.get("/setup", (req, resp) => {
  require("../config/setup");
  resp.send({ message: "Database Matcha created succefully" });
});

/* Socket.io */

var connections = [];
var clients = [];
var onlineTab = [];



// #origin code
var mainSocket = io.on("connection", async socket => {
  await onlineTab.push({
    userID: socket.handshake.query["userID"],
    socketID: socket.id
  });

  chatController.onlineStatus(socket.handshake.query["userID"]);
  /* console.log("%d socket(s) online", onlineTab.length);
  console.log({ onlineTab }); */

  socket.broadcast.emit("online", {
    user_id: socket.handshake.query["userID"],
    status: "Online"
  });

  socket.on("sendNotif", async (type, user_id, target_id) => {
    var sendNotif = await userController.manageNotif(type, user_id, target_id);
    var isBlocked = await userModel.checkUserIsBlocked(user_id, target_id);
    if (sendNotif && !isBlocked) {
      socket.broadcast.emit("newNotif", target_id);
    }
  });

  socket.on("disconnect", reason => {
    //console.log(reason);
    for (var i = 0; i < onlineTab.length; i++) {
      if (onlineTab[i]["socketID"] == socket.id) onlineTab.splice(i, 1);
    }
    var result = onlineTab.find(
      elem => elem.userID === socket.handshake.query["userID"]
    );
    if (result === undefined) {
      socket.broadcast.emit("offline", {
        user_id: socket.handshake.query["userID"],
        status: "Offline"
      });
      chatController.offlineStatus(socket.handshake.query["userID"]);
      /* console.log("%d socket(s) online", onlineTab.length);
      console.log({ onlineTab }); */
    }
  });
});

var nsp = io.of("/chat");

/*
nsp.on("connection", socket => {
  // Get variables
  var userID = socket.handshake.query["userID"];
  var userToken = socket.handshake.query["token"];
  var userName = socket.handshake.query["userName"];
  var room_id = socket.handshake.query["room_id"];

  console.log(`ROOM_ID: ${room_id}`);


  socket.join(room_id);

  socket.on(room_id, async (data,image, userID_other) => {

    socket.broadcast.emit(room_id, "....Received!");

   var sav = await chatController.saveMessage([data, userID, room_id,image]).then(async()=>{



    });

    var msg= await  chatController.getLastChatMessages(room_id).then((xxx)=> {
      console.log(`....xxx: ${xxx.content}`);
      console.log(`room_id: ${room_id}`);
      socket.broadcast.emit(room_id, xxx);
    } )



    chatController.saveNotification(
      userID_other,
      userID,
      "message",
      "",
      room_id
    )
    ;


    var isBlocked = await userModel.checkUserIsBlocked(userID_other, userID);
    if (!isBlocked) mainSocket.emit("new message", { room_id, userID_other });
  });

  socket.on("readMessage", data => {
    chatController.readMessage(data, userID);
    mainSocket.emit("readMessage", userID, data);
  });

  socket.on("disconnect", () => {
    connections.splice(-1, 1);
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.socketID == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });


});
*/

nsp.on('connection', socket => {

  var userID = socket.handshake.query["userID"];
  var userToken = socket.handshake.query["token"];
  var userName = socket.handshake.query["userName"];
  var room_id = socket.handshake.query["room_id"];

  console.log(`ROOM_ID: ${room_id}`);

  socket.join(room_id);

  //socket.on('joinRoom',
  /*socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    // General welcome
    socket.emit('message', formatMessage("WebCage", 'Messages are limited to this room! '));

    // Broadcast everytime users connects
    socket.broadcast
        .to(user.room)
        .emit(
            'message',
            formatMessage("WebCage", `${user.username} has joined the room`)
        );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });*/


  // Listen for client message
  socket.on(room_id, async  (data, userID_other,tag_id,is_replied,replied_to,sticker_id) => {
    /*const user = getActiveUser(socket.id);*/
    console.log(`date:${data}\nimage: ${image}\nuserID:${userID_other}`)


    var sav = await  chatController.saveMessage([data, userID, room_id,tag_id,is_replied,replied_to,sticker_id]).then(async()=>{



    });

    var msg=  await chatController.getLastChatMessages(room_id).then((xxx)=> {
      console.log(`....xxx: ${xxx.content}`);

      nsp.to(room_id).emit(room_id, xxx);
    } )



    chatController.saveNotification(
        userID_other,
        userID,
        "message",
        "",
        room_id
    )
    ;


    var isBlocked =  userModel.checkUserIsBlocked(userID_other, userID);
    if (!isBlocked) mainSocket.emit("new message", { room_id, userID_other });

   // nsp.to(room_id).emit(room_id, msg);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    /*const user = exitRoom(socket.id);*/

   /* if (user) {
      io.to(user.room).emit(
          'message',
          formatMessage("WebCage", `${user.username} has left the room`)
      );

      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }*/

  });
});



