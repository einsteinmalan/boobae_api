var UserService = require("../services/userService");
var userModel = require("../models/userModel");
var chatModel = require("../models/chatModel");
var tagModel = require("../models/tagModel");
var pictureModel = require("../models/pictureModel");
var likeModel = require("../models/likeModel");
var notifModel = require("../models/notifModel");
var input = require("../services/inputService");
var jwtUtils = require("../services/jwtService");
var notifService = require("../services/notifService");
var fs = require('fs');
let path = require('path');

module.exports = {
  checkUsername: async (req, res, next) => {
    var data = req.params.username;

    var result = await  userModel.findOne("username",data);

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result.length,status:200,message:`success!` });

  },

  findOne: async (req, res, next) => {
    var field = req.body.field;
    var data = req.body.data;

    var result = await  userModel.findOne(field,data);
    console.log(result.length);

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result,status:200,message:`success!` });

  },

  login: async (req, res, next) => {
    var user = await UserService.getUser({
      login: req.body.login,
      pwd: req.body.pwd
    });

    if (user.error) return res.status(401).json({ message: user.error,status:401 });
    else {
      var id = user.userData[0]["id"];
      var username = user.userData[0]["username"];
      console.log("id: "+ id);
      console.log("username: "+ username);
      return res.status(200).json({
        status: 200,
        message: "Succesfully User Retrieved",
        username: username,
        id:id,
        token: jwtUtils.tokenGenerator([id, username])
      });
    }
  },

  updateUserField: async (req, res, next) => {
    var err = "";
    switch (req.params.field) {
      case "firstname":
        err = await input.firstname(req.body.data);
        break;
      case "lastname":
        err = await input.lastname(req.body.data);
        break;
      case "mail":
        err = await input.mail(req.body.data);
        break;
      default:
        err = "wrong field";
        break;
    }

    if (err.error) {
      return res
        .status(400)
        .json({ error: `${req.params.field} ` + err.error });
    }
    if (err === "wrong field") {
      return res
        .status(400)
        .json({ error: `${req.params.field} is a wrong field` });
    }

    var result = await userModel.updateOne(
      req.params.id,
      req.params.field,
      req.body.data
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `${req.params.field} updated`
      });
    }
  },

  updateUserData: async (req, res, next) => {
    var err;
    if (
      req.body.data.lastname &&
      (err = input.lastname(req.body.data.lastname).error)
    )
      return res.status(400).json({ error: "lastname " + err });
    if (
      req.body.data.firstname &&
      (err = input.firstname(req.body.data.firstname).error)
    )
      return res.status(400).json({ error: "firstname " + err });
    if (req.body.data.mail) {
      err = await input.mail(req.body.data.mail);
      if (err.error)
        return res.status(400).json({ error: "mail " + err.error });
    }
    if (req.body.data.bio && (err = input.bio(req.body.data.bio).error))
      return res.status(400).json({ error: "bio " + err });
    if (
      req.body.data.birthdate &&
      (err = input.date(req.body.data.birthdate).error)
    )
      return res.status(400).json({ error: "birthdate " + err });

    var result = await userModel.updateData(req.params.id, req.body.data);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  deleteUserTag: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.tag_id)) {
      return res.status(400).json({ error: "Couldn't update tag" });
    }

    var result = await tagModel.deleteOne(req.params.user_id, req.body.tag_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  createUserTag: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.tag_id)) {
      return res.status(400).json({ error: "Couldn't update tag" });
    }

    var result = await tagModel.addOne(req.params.user_id, req.body.tag_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  deleteUserPicture: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.pic_index)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.deleteOne(
      req.params.user_id,
      req.body.pic_index
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  updateUserPicture: async (req, res, next) => {
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.updateOne(
      req.params.user_id,
      req.body.data
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },


  updateUserField: async (req, res, next) => {
    if (isNaN(req.body.user_id)) {
      return res.status(400).json({ message: "Couldn't update picture" });
    }

    var result = await userModel.updateOne(
        req.body.user_id,
        req.body.field,
        req.body.data
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  updateSetPro: async (req, res, next) => {
    if (isNaN(req.body.user_id)) {
      return res.status(400).json({ message: "Couldn't update status" });
    }

    var result = await userModel.updateSetPro(
        req.body.user_id,
        req.body.subscription_type
    );

    if (result.error) return res.status(401).json({ message: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  updateRemovePro: async (req, res, next) => {
    if (isNaN(req.body.user_id)) {
      return res.status(400).json({ message: "Couldn't update picture" });
    }

    var result = await userModel.updateRemovePro(
        req.body.user_id,
    );

    if (result.error) return res.status(401).json({ message: result.error });
    else {
      return res.status(200).json({
        message: `User Pro status removed updated`
      });
    }
  },

  updateUserProfilePicture: async (req, res, next) => {
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.updateUserProfilePicture(
      req.params.user_id,
      req.body.pic_index,
      req.body.pic_url
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`
      });
    }
  },

  forgotPassword: async (req, res, next) => {
    var user = await UserService.doesUserLoginExist({
      login: req.body.login
    });

    if (user.error) return res.status(401).json({ message: user.error });
    else {
      UserService.resetUserPassword(user.userData);
      return res.status(200).json({
        message: "User does exist"
      });
    }
  },

  checkPasswordResetKey: async (req, res, next) => {
    var result = await userModel.findOne("password_key", req.params.key);
    if (result != "") {
      return res
        .status(200)
        .json({ message: "Successfully reached password reset" });
    } else
      return res
        .status(401)
        .json({ message: "password reset key isn't valid" });
  },

  verifyPasswordWithId: async (req, res, next) => {
    var err;
    if ((err = input.password(req.body.password).error))
      return res.status(400).json({ message: "password " + err });
    var result = await UserService.verifyPasswordWithId(
      req.body.password,
      req.params.id
    );

    if (result.status !== "Password is valid")
      return res.status(401).json({ message: "Password isn't valid" });
    else {
      return res.status(200).json({
        message: "Password is valid"
      });
    }
  },

  updatePasswordWithId: async (req, res, next) => {
    var err;
    if ((err = input.password(req.body.password).error))
      return res.status(400).json({ message: "password " + err });
    var result = await UserService.updatePasswordWithId(
      req.body.password,
      req.params.id
    );
    if (result.status !== "Password updated with success")
      return res.status(401).json({ message: "Couldn't update password" });
    else {
      return res.status(200).json({
        message: "Password updated"
      });
    }
  },

  updatePasswordWithKey: async (req, res, next) => {
    //Params
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;
    var key = req.body.password_key;

    //Check inputs
    var err;
    if ((err = input.password(pwd1).error))
      return res.status(400).json({ error: "password " + err });
    if ((err = input.password(pwd2).error))
      return res.status(400).json({ error: "password " + err });
    if (pwd1 !== pwd2)
      return res.status(400).json({ error: "passwords don't match" });

    var ret = await UserService.updatePasswordWithKey(pwd1, key);
    if (ret.status === "Password updated with success")
      return res.status(201).send(ret.status);
    else return res.status(400).send(ret.status);
  },

  checkValidity: async (req, res, next) => {
   //console.log(req.params.key);
    var result = await userModel.findOne("key", req.params.key);
    if (result != "") {
      var updated = await userModel.updateRegister(req.params.key);
      if (updated)
        return res.status(200).json({ message: "Successfully activated" });
      else return res.status(400).json({ message: "couldn't update status" });
    } else return res.status(400).json({ message: "couldn't update status" });
  },

  createUser: async (req, res, next) => {
    //Params
   /* var lastname = req.body.lastname;
    var firstname = req.body.firstname;*/
    var username = req.body.username;
    var mail = req.body.email;
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;

/*    var city = req.body.location["address"]["city"];
    var latitude = req.body.location["coords"]["latitude"];
    var longitude = req.body.location["coords"]["longitude"];*/

    var gender = req.body.gender;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    //Check inputs
    var err;
/*    if ((err = input.lastname(lastname).error))
      return res.status(400).json({ error: "lastname " + err });
    if ((err = input.firstname(firstname).error))
      return res.status(400).json({ error: "firstname " + err });*/

    if ((err = input.password(pwd1).error))
      return res.status(400).json({ error: "password " + err });
    if ((err = input.password(pwd2).error))
      return res.status(400).json({ error: "password " + err });

    err = await input.username(username);
    if (err.error)
      return res.status(400).json({ error: "username " + err.error });
    err = await input.mail(mail);
    if (err.error) return res.status(400).json({ error: "mail " + err.error });

    //Create new user
    var ret = await UserService.createUser([
   /*   lastname,
      firstname,*/
      username,
      mail,
      pwd1,
      gender,
      latitude,
      longitude
    ]);
    if (ret.status === "User created with success")
      return res.status(201).send(ret.status);
    else return res.status(400).send(ret.status);
  },

  getUserProfile: async (req, res, next) => {
    // Get user id from username
    var userId = await UserService.getUserIdFromUsername(req.params.username);
    if (userId.error) return res.status(401).json({ message: userId.error });

    // Get data from db based on user access rights
    var userData = await UserService.getUserData(userId);
    var userPictures = await UserService.getUserPictures(userId);
    var userTags = await UserService.getUserTags(userId);
    var allTags = await UserService.getAllTags(userId);

    if (userData.error)
      return res.status(401).json({ message: userData.error });

    return res.status(200).json({
      data: userData,
      pictures: userPictures,
      tags: userTags,
      allTags: allTags
    });
  },

  getUserProfileFromUserId: async (req, res, next) => {
    // Get user id from username
    var userId = req.params.user_id;
    if (userId.error) return res.status(401).json({ message: userId.error });

    // Get data from db based on user access rights
    var userData = await UserService.getUserData(userId);
    var userPictures = await UserService.getUserPictures(userId);
    var userTags = await UserService.getUserTags(userId);
    var allTags = await UserService.getAllTags(userId);

    if (userData.error)
      return res.status(401).json({ message: userData.error });

    return res.status(200).json({
      data: userData,
      pictures: userPictures,
      tags: userTags,
      allTags: allTags
    });
  },

  deleteUser: async (req, res, next) => {
    var authorization = req.body.headers.authorization;
    var userId = jwtUtils.getUserId(authorization);

    if (userId != -1 && req.params.user_id == userId) {
      await userModel.deleteUser(userId);
      await tagModel.deleteUserAllTags(userId);
      await pictureModel.deleteUserAllPictures(userId);
    }
    return res.status(200).json({ msg: "Bravoooo!" });
  },

  getMainNotification: async (req, res, next) => {
    var userID = req.params["userID"];
    var ret = await userModel.getNotification(userID);

    var blocked = await userModel.getBlockedUsersFromMyId(userID);

    for (var i = 0; i < ret.length; i++) {
      for (var k = 0; k < blocked.length; k++) {
        if (ret[i]["sender_id"] == blocked[k]["user_id"]) ret.splice(i, 1);
      }
    }
    return res.status(200).json({ tab: ret });
  },

  dismissNotif: async (req, res, next) => {
    var userID = req.params["userID"];
    var result = await userModel.dismissNotif(userID);
    if (result) return res.status(200).json({ msg: "Notifications dismissed" });
    else
      return res.status(200).json({
        error: "An error occurred and notifcations could not be dismissed"
      });
  },

  checkUserLikedByAndReverse: async (req, res, next) => {
    var by_id = await UserService.getUserIdFromUsername(req.params.username);
    var ret = await likeModel.checkUserLikedBy(req.params["user_id"], by_id);
    var retRev = await likeModel.checkUserLikedBy(by_id, req.params["user_id"]);
    return res.status(200).json({ likedBy: ret, reverse: retRev });
  },

  deleteUserLike: async (req, res, next) => {
    if (isNaN(req.body.user_id) || isNaN(req.body.by_id)) {
      return res.status(400).json({ message: "Couldn't update like" });
    }

    var result = await likeModel.deleteOne(
      req.body.user_id,
      req.body.by_id
    );

    if (result.error) return res.status(401).json({ message: result.error });
    else {
      return res.status(200).json({
        message: `User like deleted!`,
        data:!!result
      });
    }
  },

  createUserLike: async (req, res, next) => {
    if (isNaN(req.body.user_id) || isNaN(req.body.by_id)) {
      return res.status(400).json({ error: "Couldn't update like" });
    }

    var result = await likeModel.addOne(req.body.user_id, req.body.by_id);

    if (result.error) return res.status(401).json({ error: result.error,message:`Operation failed!`, data:false });
    else {
      return res.status(200).json({
        message: `User LIKE created`,
        data: true
      });
    }
  },

  manageNotif: async (type, user_id, target_id) => {
    var sendNotif = false;
    var username = await userModel.getUsernameFromId(user_id);
    username = await username[0].username;
    switch (type) {
      case "visit":
        sendNotif = await notifService.visit(user_id, target_id, username);
        break;
      case "like":
        notifService.like(user_id, target_id, username);
        sendNotif = true;
        break;
      case "dislike":
        await notifService.dislike(user_id, target_id, username);
        sendNotif = true;
        break;
      case "like_back":
        await notifService.like_back(user_id, target_id, username);
        sendNotif = true;
        break;
    }
    return sendNotif;
  },

  reportUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;
    var reason = req.params.reason;

    var result = await userModel.reportUser([target_id, user_id,reason]);
    if (result)
      return res.status(200).json({ message: "Successfully reported!" });
    return res
      .status(200)
      .json({ message: "Impossible to report this user for now" });
  },

  getUserRoomId: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    if (target_id == user_id) return res.status(200).json({ room_id: null });

    var result = await userModel.getUserRoomId(target_id, user_id);

    return res.status(200).json({ room_id: result[0].room_id });
  },

  checkUserIsReported: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.checkUserIsReported(user_id, target_id);
    return res.status(200).json({ isReported: result });
  },

  blockUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.blockUser(user_id, target_id);
    if (result)
      return res.status(200).json({ message: "Successfully blocked!" });
    return res
      .status(200)
      .json({ message: "Impossible to block this user for now..." });
  },

  unblockUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.unblockUser(user_id, target_id);
    if (!result)
      return res.status(200).json({ message: "Successfully unblocked!" });
    return res
      .status(200)
      .json({ message: "Impossible to unblock this user for now..." });
  },

  checkUserIsBlocked: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.checkUserIsBlocked(user_id, target_id);
    return res.status(200).json({ isBlocked: result });
  },

  getUserProfilePicture: async (req, res, next) => {
    console.log(`userCOntroller : getUserProfilePicture \n ${req.params.user_id}`)
    var picture = await pictureModel.findProfile("user_id", req.params.user_id);
    console.log(picture);
    if (picture.length < 1) picture = null;
    return res
      .status(200)
      //.json({ picture: picture ? picture[0].url : "person.jpg" });
       .json({ picture: picture ? picture[0].url : "person.jpg" });
  },

  getUserProfilesVisitedId: async (req, res, next) => {
    var user_id = req.params.user_id;
    var profilesVisited = await notifModel.getUserProfilesVisitedId(user_id);

    if (profilesVisited.error)
      return res.status(401).json({ error: profilesVisited.error });
    if (!profilesVisited) profilesVisited = null;

    return res.status(200).json({ profiles_visited: profilesVisited });
  },

  getUserProfilesLikedId: async (req, res, next) => {
    var user_id = req.body.user_id;
    var profilesLiked = await likeModel.getUserProfilesLikedId(user_id);

    if (profilesLiked.error)
      return res.status(401).json({ error: profilesLiked.error });
    if (!profilesLiked) profilesLiked = null;

    return res.status(200).json({ profiles_liked: profilesLiked });
  },

  getUserProfilesBlockedId: async (req, res, next) => {
    var user_id = req.params.user_id;
    var profilesBlocked = await userModel.getBlockedUsersFromMyId(user_id);

    if (profilesBlocked.error)
      return res.status(401).json({ error: profilesBlocked.error });
    if (!profilesBlocked) profilesBlocked = null;

    return res.status(200).json({ profiles_blocked: profilesBlocked });
  },

  getUserListProfileDataFromId: async (req, res, next) => {
    var userId = req.params.user_id;

    var result = await userModel.getListProfileDataFromId(userId);

    if (result.error) return res.status(401).json({ error: result.error });

    return res.status(200).json({ data: result });
  },

  /**
   * Added by me
   * */

  createUserStatusImage: async (req, res, next) => {
    console.log(`USER_ID-->: ${req.params.user_id}`);
    console.log(`Message TEXT -->: ${req.query.message_text}`);
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't create status!" });
    }

    var result = await userModel.createUserStatusImage(req.params.user_id,req.file.filename, req.query.message_text,req.query.everybody_see,req.query.show_to,req.query.chat_request);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(201).json({
        message: `status created successfully!`,

      });
    }
  },

  //Create chat_images
  createChatImage: async (req, res, next) => {
    console.log(`USER_ID-->: ${req.params.user_id}`);
    console.log(`Chat TEXT -->: ${req.query.content}`);
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't save image!" });
    }

    var result = await chatModel.createChatImage(req.params.user_id,req.file.filename, req.query.content,req.query.room_id,req.query.tag_id,req.query.is_replied, req.query.replied_to,req.query.sticker_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(201).json({
        message: `chat image message sent!`,
        data:[]

      });
    }
  },





  createUserStatusText: async (req, res, next) => {
    console.log(`userID: ${req.query.user_id}\n msg: ${req.query.message_text} \n Min_: ${req.query.min_color} \n max_: ${req.query.max_color} \n tag_id: ${req.query.tag_id}`);
    var authorization = req.headers.authorization;
    console.log("AUTHORIZATION:" +authorization);
    var userId = jwtUtils.getUserId(authorization);

    /*if (isNaN(req.post.user_id)) {
      return res.status(400).json({ error: "Couldn't create status!" });
    }*/

    var myText = req.query.message_text;
    var  textmsg = `${myText} `;

    var result = await userModel.createUserStatusText(req.query.user_id, textmsg,req.query.min_color,req.query.max_color,req.query.tag_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(201).json({
        message: `status sent successfully!`,

      });
    }

    if (userId != -1 && req.query.user_id == userId){



    }else {
      return res.status(401).json({ message: "Unauthorized",status:401 });
    }

  },


  createOne: async (req, res, next) => {
    console.log("PICT UPLOAD - UserID:" + req.params.user_id);
    var authorization = req.headers.authorization;
    console.log("AUTHORIZATION:" +authorization);
    var userId = jwtUtils.getUserId(authorization);

    if (userId != -1 && req.params.user_id == userId){
      if (isNaN(req.params.user_id)) {
        return res.status(401).json({ message: "Couldn't upload picture!", status: 401 });
      }
     // console.log("PICT UPLOAD - UserID:" + req.body.user_id);
     // console.log("PICT UPLOAD - UserID:" + req.file.filename);
      var picture = await pictureModel.findProfile("user_id", req.params.user_id);

      picture = picture ?? [];

      if (picture.length == 0){
        console.log("No previous image detected...");
        var result = await pictureModel.createOne(req.params.user_id,req.file.filename,1,1 );

        var result_pic = await userModel.updateOne(
            req.params.user_id,
            "profile_picture_url",
            req.file.filename
        );

        if (result.error) return res.status(401).json({ message: result.error,status:401 });
        else {
          return res.status(201).json({
            message: `Picture uploaded successfully!`,

          });
        }
      }else{
        console.log("previous image detected...!");


        var picture = await pictureModel.findProfile("user_id", req.params.user_id)
        console.log(`Image Result: ${picture}`);

         var img = picture[0].url;
        path = `./user_image/${img}`;

        try {
          fs.unlinkSync(path)

          console.log(`${path} has been deleetd!`)

          //file removed
        } catch(err) {
          console.error(err)
        }

        await pictureModel.deleteOne(req.params.user_id, 1);

        var result = await pictureModel.createOne(req.params.user_id,req.file.filename,1,1 );
        var result_pic = await userModel.updateOne(
            req.params.user_id,
            "profile_picture_url",
            req.file.filename
        );

        if (result.error) return res.status(401).json({ message: result.error,status:401 });
        else {
          return res.status(201).json({
            message: `Picture uploaded successfully!`,
            image_url: req.file.filename,

          });
        }
      }


    }else {
      return res.status(401).json({ message: "Unauthorized",status:401 });
    }


  },

  //# Subscription
  updateUserVipSubscription:  async (req, res, next) => {  // FOR: is_pro & subscription_package
    var userId = req.body.user_id;
    var field = req.body.field;
    var data = req.body.data;

    var result = await userModel.updateUserVipSubscription(userId,field,data);

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result,status:200,message:`success` });

  },

  updateVipSubscriptionDate: async (req, res, next) => {

    var userId = req.body.user_id;

    var result = await userModel.updateVipSubscriptionDate(userId);


    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result,status:200,message:`success` });

  },

  checkUserVipSubscription: async (req, res, next) => {

    var userId = req.body.user_id;

    var result = await userModel.checkUserVipSubscription(userId);
    var resl = result[0].is_pro;

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data:resl,status:200,message:`success` });

  },

  checkUserVipPackage: async (req, res, next) => {

    var userId = req.body.user_id;

    var result = await userModel.checkUserVipPackage(userId);
    var resl = result[0].subscription_package;

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data:resl,status:200,message:`success` });

  },

  getUserVipPackage: async (req, res, next) => {

    var userId = req.params.user_id;

    var result = await userModel.getUserVipPackage(userId);

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result,status:200,message:`success` });

  },

  checkVipDaysElapsed:  async (req, res, next) => {

    var userId = req.params.user_id;

    var result = await userModel.checkVipDaysElapsed(userId);

    if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
    else  return res.status(200).json({ data: result,status:200,message:`success` });

  }






  };
