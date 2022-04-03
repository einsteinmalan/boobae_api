var express = require("express");
var userController = require("../controllers/socialController");
const muller = require("multer");
const  path = require("path");
const app = express();
const multer = require("multer");
const socialController = require("../controllers/socialController");




exports.router = (() => {
    var socialRouter = express.Router();

    socialRouter
        .route("/status/findone")  //:id
        .post(socialController.findOneStatus);

    socialRouter
        .route("/status/get-all")   //:user_id
        .post(socialController.getAllFromUserStatus);

    socialRouter
        .route("/status/get-all-status")   //:user_id
        .post(socialController.getAllStatus);

    socialRouter
        .route("/status/user-one")  //:user_id, :id
        .post(socialController.findOneFromUserStatus);

    socialRouter
        .route("/status/delete-one")  //:id
        .post(socialController.deleteOneStatus);

    socialRouter
        .route("/status/user-delete-one")  //:user_id, :id
        .post(socialController.deleteOneFromUserStatus);

    socialRouter
        .route("/status/seen-count")  //:id
        .post(socialController.allSeenCount);

    socialRouter
        .route("/status/create-seens")  //:id
        .post(socialController.createSeen);

/*    socialRouter
        .route("/status/user-delete-all")  //:user_id
        .post(socialController.deleteAllFromUserStatus);*/

    socialRouter
        .route("/status/seen-all")  //:id
        .post(socialController.getAllSeenFromStatus);

    socialRouter
        .route("/status/get-user-location")  //:id
        .post(socialController.getUserLocation);

    socialRouter
        .route("/status/get-user-requests")  //:id
        .post(socialController.getUserReceivedLikes);

    socialRouter
        .route("/status/seen-list")  //:id
        .post(socialController.getSeenList);

    socialRouter
        .route("/status/delete-all")    //:status_id
        .post(socialController.deleteAllSeenFromStatus);

    socialRouter
        .route("/leaderboard/check")  //:user_id
        .post(socialController.checkLeaderboardExist);

    socialRouter
        .route("/leaderboard/create")   //:user_id
        .post(socialController.createLeaderboardRecord);

    socialRouter
        .route("/leaderboard/user-get")        //:user_id
        .post(socialController.getUserLeaderboard);

    socialRouter
        .route("/leaderboard/getAll")        //:user_id
        .post(socialController.getAllLeaderboard);

    socialRouter
        .route("/leaderboard/update-one")   ////:field_two, :field, :data, :data_two
        .post(socialController.updateOneLeaderboard);

    socialRouter
        .route("/leaderboard/increase-silver")    //:user_id,:score
        .post(socialController.increaseSilver);

    socialRouter
        .route("/leaderboard/increase-copper")    //:user_id,:score
        .post(socialController.increaseCopper);

    socialRouter
        .route("/leaderboard/increase-gold")    //:user_id,:score
        .post(socialController.increaseGold);

    socialRouter
        .route("/leaderboard/check-rank")      //:user_id
        .post(socialController.checkRankExist);

    socialRouter
        .route("/leaderboard/rank-create-record")  //user_id, :leaderboard_id, :total_points
        .post(socialController.createRankRecord);

    socialRouter
        .route("/leaderboard/user-delete-rank")   //:user_id
        .post(socialController.deleteUserRanks);

    socialRouter
        .route("/leaderboard/delete-any-rank")  //:id
        .post(socialController.deleteAnyRanks);

    socialRouter
        .route("/leaderboard/get-all-rank")    //:num_days
        .post(socialController.getAllRanks);

    socialRouter
        .route("/leaderboard/getallranksbysex")    //:num_days
        .post(socialController.getAllRanksBySex);



    socialRouter
        .route("/settings/create-settings")   //:user_id
        .post(socialController.createSettings);


    socialRouter
        .route("/settings/check-exists")
        .post(socialController.checkSettings);

    socialRouter
        .route("/settings/find-one-settings")   //:id
        .post(socialController.findOneSettings);

    socialRouter
        .route("/settings/find-user-settings")
        .post(socialController.findUserSettings);

    socialRouter
        .route("/settings/delete-one-settings")   //:id
        .post(socialController.deleteOneSettings);

    socialRouter
        .route("/settings/delete-user-settings")         //:user_id
        .post(socialController.deleteUserSettings);

    socialRouter
        .route("/settings/update-one-settings")  //:user_id  :field  :data
        .post(socialController.updateOneSettings);

    socialRouter
        .route("/request/create")  //:user_id   :target_id
        .post(socialController.createRequest);

    socialRouter
        .route("/request/check")    //:user_id
        .post(socialController.checkIfRequestExist);

    socialRouter
        .route("/request/user-find")  ////:user_id, :target_id
        .post(socialController.findUserRequest);

    socialRouter
        .route("/request/user-total")   //:user_id
        .post(socialController.findTotalUserRequest);

    socialRouter
        .route("/request/user-delete-all")  //:user_id
        .post(socialController.deleteAllRequestFromUser);

    socialRouter
        .route("/request/time-elapsed")  //:user_id
        .post(socialController.checkRequestTimeElapsed);

    socialRouter
        .route("/admin/create-config")   //:name   :value
        .get(socialController.createConfig);

    socialRouter
        .route("/admin/config-find")     //:name
        .get(socialController.findOneConfig);

    socialRouter
        .route("/admin/config-all")
        .get(socialController.selectAllConfig);

    socialRouter
        .route("/admin/config-update")    //:id , :value
        .get(socialController.updateConfig);




    return socialRouter;
})();

