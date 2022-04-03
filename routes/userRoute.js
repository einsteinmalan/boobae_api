var express = require("express");
var userController = require("../controllers/userController");
const muller = require("multer");
const  path = require("path");
const app = express();
const multer = require("multer");




exports.router = (() => {
  var userRouter = express.Router();

  userRouter
      .route("/check-existence/:username")
      .get(userController.checkUsername);

  userRouter
    .route("/verify/:id/password")
    .post(userController.verifyPasswordWithId);
  userRouter
    .route("/update/:id/password")
    .post(userController.updatePasswordWithId);

  /*userRouter
    .route("/update/:id/custom/:field")
    .post(userController.updateSetPro);*/

  userRouter
      .route("/update/user-set-pro")
      .post(userController.updateSetPro);

  userRouter
      .route("/update/user-remove-pro")
      .post(userController.updateRemovePro);

  userRouter.route("/update/:id").post(userController.updateUserData);
  userRouter.route("/delete/:user_id/tag").post(userController.deleteUserTag);
  userRouter.route("/create/:user_id/tag").post(userController.createUserTag);
  userRouter
    .route("/delete/:user_id/picture")
    .post(userController.deleteUserPicture);
  userRouter
    .route("/update/:user_id/picture")
    .post(userController.updateUserPicture);
  userRouter
    .route("/update/:user_id/profile_picture")
    .post(userController.updateUserProfilePicture);
  userRouter.route("/register/:key").get(userController.checkValidity);
  userRouter.route("/profile/:username").get(userController.getUserProfile);
  userRouter
    .route("/profile/id/:user_id")
    .get(userController.getUserProfileFromUserId);
  userRouter
    .route("/profile/:user_id/liked_by/:username")
    .get(userController.checkUserLikedByAndReverse);
  userRouter
    .route("/delete/user-like")
    .post(userController.deleteUserLike);  // user_id .. by_id
  userRouter
    .route("/create/user-like")
    .post(userController.createUserLike);  // user_id .. by_id
  userRouter.route("/login").post(userController.login);
  userRouter.route("/forgot-password").post(userController.forgotPassword);
  userRouter
    .route("/reset-password/:key")
    .get(userController.checkPasswordResetKey);
  userRouter
    .route("/reset-password/:key")
    .post(userController.updatePasswordWithKey);
  userRouter.route("/register").post(userController.createUser);
  userRouter
    .route("/notification/main/:userID")
    .get(userController.getMainNotification);
  userRouter
    .route("/read-notification/:userID")
    .post(userController.dismissNotif);
  userRouter.route("/delete/:user_id").post(userController.deleteUser);
  userRouter
    .route("/report/:user_id/:target_id/:reason")
    .get(userController.reportUser);
  userRouter
    .route("/get-room-id/:user_id/:target_id")
    .get(userController.getUserRoomId);
  userRouter
    .route("/isreported/:user_id/:target_id")
    .get(userController.checkUserIsReported);
  userRouter.route("/block/:user_id/:target_id").get(userController.blockUser);
  userRouter
    .route("/unblock/:user_id/:target_id")
    .get(userController.unblockUser);
  userRouter
    .route("/isblocked/:user_id/:target_id")
    .get(userController.checkUserIsBlocked);
  userRouter
    .route("/profile-picture/:user_id")
    .get(userController.getUserProfilePicture);
  userRouter
    .route("/profiles-visited/:user_id")
    .get(userController.getUserProfilesVisitedId);
  userRouter
    .route("/profiles-liked")
    .post(userController.getUserProfilesLikedId);
  userRouter
    .route("/profiles-blocked/:user_id")
    .get(userController.getUserProfilesBlockedId);
  userRouter
    .route("/profile/:user_id/list-profile")
    .get(userController.getUserListProfileDataFromId);


  /**
   *
   * This section is added by fred -- Creating user image upload
   * */

  const storages = multer.diskStorage({
    destination: 'user_image',
    filename: (req, file, cb) => {
    //  console.log(req.body());
      //return cb(null, `${~~(Math.random() * 999999)}${path.extname(file.originalname)}`)
     return cb(null, `${file.fieldname}_${~~(Math.random() * 999999)}_${Date.now()}${path.extname(file.originalname)}`)
    }
  });

  const uploads = multer({
    storage: storages,
    limits: {
      fileSize: 3000000
    }
  });
  userRouter.use('/mypicture', express.static('user_image'));
  // app.post("/upload/status", upload.single('image'), userController.createUserStatus);

  userRouter
      .route("/upload/userpicture/:user_id")
      .post(uploads.single('picture'),userController.createOne);


  /**
   *
   * This section is added by fred -- Creating status image upload
   * */

  const storage = multer.diskStorage({
    destination: 'status_image',
    filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)

    }
  })

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 3000000
    }
  })
  userRouter.use('/userstatus', express.static('status_image'));
 // app.post("/upload/status", upload.single('image'), userController.createUserStatus);

  userRouter
      .route("/upload/status-image/:user_id")
      .post(upload.single('image'),userController.createUserStatusImage);

  //------------->  #Status




  //==========#Chat_images

  /**
   *
   * This section is added by fred -- Creating chat image upload
   * */

  const storag = multer.diskStorage({
    destination: 'chat_image',
    filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)

    }
  })

  const uploader = multer({
    storage: storag,
    limits: {
      fileSize: 3000000
    }
  })
  userRouter.use('/chatimages', express.static('chat_image'));
  // app.post("/upload/status", upload.single('image'), userController.createUserStatus);

  userRouter
      .route("/upload/chat-image/:user_id")
      .post(uploader.single('image'),userController.createChatImage);



  //===============================================================> Chat images


  userRouter
      .route("/status/status-text")   //:user_id/:field/:data
      .post(userController.createUserStatusText);


  //------------->  #Subscription Route
  userRouter
      .route("/vip/update-info")   //:user_id/:field/:data
      .post(userController.updateUserVipSubscription);

  userRouter
      .route("/vip/subscription-date")   //:user_id
      .post(userController.updateVipSubscriptionDate);

  userRouter
      .route("/vip/check-subscription")   //:user_id
      .post(userController.checkUserVipSubscription);

  userRouter
      .route("/vip/check-subscription-package")   //:user_id
      .post(userController.checkUserVipPackage);

  userRouter
      .route("/vip/check-package")   //:user_id
      .post(userController.getUserVipPackage);

  userRouter
      .route("/vip/days-elapsed")   //:user_id
      .post(userController.checkVipDaysElapsed);




  return userRouter;

})();

