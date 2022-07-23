const userModel = require("../models/userModel");
const pictureModel = require("../models/pictureModel");
const tagModel = require("../models/tagModel");
const statusModel = require("../models/statusModel");
const settingsModel = require("../models/settingsModel");
const requestModel = require("../models/requestModel");
const mainService = require("../services/mainService");
const configModel = require("../models/configModel");
const likeModel = require("../models/likeModel");
var jwtUtils = require("../services/jwtService");
const statusLeaderboard = require("../models/leaderboardModel");
const moment = require("moment");
var fs = require('fs');
let path = require('path');



module.exports = {

    //------> #statuses Queries
    //CRON
    deleteAllExpiredSeen: async (req, res, next) => { //#used


        var result = await statusModel.deleteAllExpiredSeen();
        console.log(`Deleted = ${result}`);
       // return res.status(200).json({ data: result,status:200,message:"success" });

    },

    findOneStatus: async (req, res, next) => { //#used
        var id = req.body.id;
        var limit = req.body.limit;

        var result = await statusModel.findOneStatus(id,limit);
        return res.status(200).json({ data: result,status:200,message:"success" });

    },


    getAllStatus: async (req, res, next) => { //#used
        var limit = req.body.limit;

        var result = await statusModel.getAllStatus(limit);
        return res.status(200).json({ data: result,status:200,message:"success" });

    },

    allSeenCount: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var  result = await statusModel.allSeenCount(user_id);
        return res.status(200).json({ data: result[0],status:200,message:`success` });

    },

    getSeenList: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var status = await statusModel.getProStatus(user_id);
        var is_pro = status["is_pro"];
        console.log(is_pro);

        if(!is_pro){
            var  result = await statusModel.getSeenList(user_id);
            return res.status(200).json({ data: result,status:200,message:`success`,  is_pro: true });
        }else {
            return res.status(200).json({ data: [],status:200,message:`success`,  is_pro: false });
        }
    },

    //create getLocation
    getUserLocation: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var  result = await statusModel.getUserLocation(user_id);
        if (result.error) return res.status(401).json({ error: result.error,message:`Operation failed!`, data:result })
        return res.status(200).json({ data: result[0],status:200,message:`success` });
    },

    createSeen: async (req, res, next) => {

        var user_id = req.body. user_id
        var status_id = req.body.status_id;
        var author_id = req.body.author_id;


        var record = await statusModel.checkIfUserSeenExist(user_id,author_id);

        console.log(record);

        if(record.length > 0){

            return res.status(200).json({
                message: `Record exist already`,
                data: []
            });
        }else {
              var result = await statusModel.createSeen(user_id,status_id,author_id);

        if (result.error) return res.status(401).json({ error: result.error,message:`Operation failed!`, data:result });
        else {
            return res.status(200).json({
                message: `Seen been created`,
                data: result
            });
        }
        }

    },


    getUserReceivedLikes: async (req, res, next) => {

        var user_id = req.body.user_id;
        var limit = req.body.limit;
        var  result  = await likeModel.getUserReceivedLikes(user_id,limit);
        console.log(result);

        return res.status(200).json({ data: result,status:200,message:`success` });

    },














    getAllFromUserStatus: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var  result = await statusModel.getAllFromUserStatus(user_id);
        return res.status(200).json({ data: result,status:200,message:`success` });

    },

    findOneFromUserStatus: async (req, res, next) =>{
        var id = req.body.id;
        var user_id = req.body.user_id;

        var result = await statusModel.findOneFromUserStatus(id,user_id);

        return res.status(200).json({ data: result,status:200,message:`success` });
    },

    //deleteOneStatus
    deleteOneStatus: async (req, res, next) =>{
        var id = req.body.id;
        var user_id = req.body.user_id;

        var picture = await statusModel.findOneFromUserStatus(id, user_id);
        var img = picture[0].image_url;

        console.log(`Image of status to delete: \n ${img}`);

        path = `./status_image/${img}`;

        try {
            fs.unlinkSync(path)

            console.log(`${path} Status image has been deleetd!`)

            //file removed
        } catch(err) {
            console.error(err)
        }

        var result = await statusModel.deleteOneStatus(id,user_id);



        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else {
            return res.status(200).json({
                message: `Story deleted successfully!`,
                status:200,
                data:[]
            });
        }

    },

    deleteOneFromUserStatus: async (req, res, next) =>{
        var id = req.body.id;
        var user_id = req.body.user_id;

        var result = await statusModel.deleteOneFromUserStatus(id,user_id);
        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else {
            return res.status(200).json({
                message: `User status deleted!`,
                status:200,
                data:[]
            });
        }
    },



   /* deleteAllFromUserStatus:  async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await statusModel.deleteAllFromUserStatus(user_id);
        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else {
            return res.status(200).json({
                message: `All user status deleted!`,
                status:200,
                data:[]
            });
        }

    },*/

    getAllSeenFromStatus: async (req, res, next) =>{
        var id = req.body.status_id;

        var result = await statusModel.getAllSeenFromStatus(id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });

        return res.status(200).json({
            message: `All user status deleted!`,
            status:200,
            data:[]
        });
    },

    deleteAllSeenFromStatus: async (req, res, next) =>{
        var status_id = req.body.status_id;

        var result = await statusModel.deleteAllSeenFromStatus(status_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });

        return res.status(200).json({
            message: `success!`,
            status:200,
            data:[]
        });
    },

    //------> #Leaderboard

    checkLeaderboardExist: async (req, res, next) =>{

        var authorization = req.headers.authorization;
        console.log("AUTHORIZATION:" +authorization);
        var userId = jwtUtils.getUserId(authorization);

        if (userId != -1 && req.body.user_id == userId){
            if (isNaN(req.body.user_id)) {
                return res.status(400).json({ message: "Session expired! Please login again", status: 400 });
            }
            var user_id = req.body.user_id;

            var result = await statusLeaderboard.checkLeaderboardExist(user_id);

            if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
            else  return res.status(200).json({ data: result,status:200,message:`success` });


        }else {
            return res.status(401).json({ message: "Unauthorized",status:401 });
        }



    },

    createLeaderboardRecord: async (req, res, next) =>{
        var user_id = req.body.user_id;
        var copper = req.body.copper_medal;
        var silver = req.body.silver_medal;
        var gold = req.body.gold_medal;

        console.log("copper: " + copper);
        console.log("silver: " + silver);
        console.log("gold: " + gold);

        var result = await statusLeaderboard.createLeaderboardRecord(user_id,copper,silver,gold);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`Score sent!` });

    },

    getUserLeaderboard: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.getUserLeaderboard(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });
    },

    getAllLeaderboard: async (req, res, next) =>{


        var result = await statusLeaderboard.getAllLeaderboard();

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });
    },

    updateOneLeaderboard: async (req, res, next) =>{
        var field_two = req.body.field_two;
        var field = req.body.field;
        var data = req.body.data;
        var data_two = req.body.data_two;

        console.log("field_two: " + field_two);


        var result = await statusLeaderboard.updateOneLeaderboard(field_two,field,data,data_two);
        console.log("result: "+ "\n" + result);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    increaseSilver: async (req, res, next) =>{
      //  var score = req.body.score;
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.increaseSilver(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success` });

    },

    increaseCopper: async (req, res, next) =>{
       // var score = req.body.score;
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.increaseCopper(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success` });

    },

    increaseGold: async (req, res, next) =>{

       // var score = req.body.score;
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.increaseGold(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success` });

    },

    getMedal: async (req, res, next) =>{
        var field = req.body.field;
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.getMedal(user_id,field);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success` });

    },




    checkRankExist: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.checkRankExist(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success` });

    },

    createRankRecord: async (req, res, next) =>{
        //copper: 1, silver:50, gold: 100
        var user_id = req.body.user_id;
        var leaderboard_id = req.body.leaderboard_id;
        //var total_points = req.body.total_points;
        const silver = await statusLeaderboard.getMedal(user_id,`silver_medal`);
        const copper = await statusLeaderboard.getMedal(user_id,`copper_medal`);
        const gold = await statusLeaderboard.getMedal(user_id,`gold_medal`);

        console.log("Silver extracted :" + `${silver}`);

        var silverPts = silver["data"]["silver_medal"];
        var copperPts = copper["data"]["copper_medal"];
        var goldPts = gold["data"]["gold_medal"];

        console.log("silverPts :" + silverPts);
        console.log("copperPts :" + copperPts);
        console.log("goldPts :" + goldPts);

        var totalPoint = (silverPts * 50) + (copperPts * 1) + (goldPts * 100);
        console.log("Total Points calculated: "+totalPoint);

        var result = await statusLeaderboard.createRankRecord(user_id,leaderboard_id,totalPoint);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    deleteUserRanks: async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await statusLeaderboard.deleteUserRanks(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });


    },

    deleteAnyRanks: async (req, res, next) =>{
        var id = req.body.id;
        var result = await statusLeaderboard.deleteAnyRanks(id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },


    getAllRanksBySex:  async (req, res, next) =>{

       /* var authorization = req.headers.authorization;
        console.log("AUTHORIZATION:" +authorization);
        var userId = jwtUtils.getUserId(authorization);

        if (userId != -1 && req.body.user_id == userId){
            if (isNaN(req.body.user_id)) {
                return res.status(400).json({ message: "Session expired! Please login again", status: 400 });
            }



        }else {
            return res.status(401).json({ message: "Unauthorized",status:401 });
        }*/


        var num_days = req.body.num_days;

        //get user details
        var user = await userModel.findOne("id", req.body.user_id); //  var user = await userModel.findOne("id", req.body.user_id);
        var gender = user[0].gender;
        var range = mainService.getRadiusDistanceCoord(
            user[0].geo_lat,
            user[0].geo_long,
            300
        );

        console.log(range);

        var g1 = gender == "man" ? "woman":"man";
        var id = user[0].id;

        var result = await statusLeaderboard.getRanksBySex(g1,range,id,num_days);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    getAllRanks:  async (req, res, next) =>{

        var authorization = req.headers.authorization;
        console.log("AUTHORIZATION:" +authorization);
        var userId = jwtUtils.getUserId(authorization);

        if (userId != -1 && req.body.user_id == userId){
            if (isNaN(req.body.user_id)) {
                return res.status(400).json({ message: "Session expired! Please login again", status: 400 });
            }

            var num_days = req.body.num_days;
            var result = await statusLeaderboard.getAllRanks(num_days);


            if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
            else  return res.status(200).json({ data: result,status:200,message:`success!` });

        }else {
            return res.status(401).json({ message: "Unauthorized",status:401 });
        }

    },

    //------> #Settings

    checkSettings:  async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await settingsModel.findUserSettings(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result.length,status:200,message:`success!` });
    },

    createSettings:  async (req, res, next) =>{
        var authorization = req.headers.authorization;
        console.log("AUTHORIZATION:" +authorization);
        var userId = jwtUtils.getUserId(authorization);

        if (userId != -1 && req.body.user_id == userId) {
            //code here
            console.log("REACHED HERE:(USERID) "+ userId);
            var result = await settingsModel.createSettings(userId);

            if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
            else  return res.status(201).json({ message:`success!` });
        }




    },

    findOneSettings:  async (req, res, next) =>{
        var id = req.body.id;

        var result = await settingsModel.findOneSettings(id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    findUserSettings:  async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await settingsModel.findUserSettings(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });
    },

    deleteOneSettings:  async (req, res, next) =>{
        var id = req.body.id;

        var result = await settingsModel.deleteOneSettings(id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    deleteUserSettings:  async (req, res, next) =>{
        var user_id = req.body.user_id;

        var result = await settingsModel.deleteOneFromUserSettings(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    updateOneSettings: async (req, res, next) =>{
        console.log("UPDATE ONE SETTING!");
        var field = req.body.field;
        var data = req.body.data;
        var authorization = req.headers.authorization;
        var userId = jwtUtils.getUserId(authorization);
        console.log("(AUTHORIZATION:)" +authorization);
        console.log("UID:" +userId);


        if (userId != -1 && req.body.user_id == userId) {
            var result = await settingsModel.updateOneSettings(userId,field,data);

            if (result.error) return res.status(401).json({ message: result.error });
            else  return res.status(200).json({ message:`success!` });
        }else {
           return res.status(401).json({ message: "Authentication is required!" });
        }





    },


    //------> #Request

    createRequest: async (req, res, next) =>{

        var user_id = req.body.user_id;
        var target_id = req.body.target_id;

        var result = await requestModel.createRequest(user_id,target_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    checkIfRequestExist: async (req, res, next) =>{

        var user_id = req.body.user_id;

        var result = await requestModel.checkIfRequestExist(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    findUserRequest: async (req, res, next) =>{

        var user_id = req.body.user_id;
        var target_id = req.body.target_id;

        var result = await requestModel.findUserRequest(user_id,target_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    findTotalUserRequest: async (req, res, next) =>{

        var user_id = req.body.user_id;

        var result = await requestModel.findTotalUserRequest(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });
    },

    deleteAllRequestFromUser:  async (req, res, next) =>{

        var user_id = req.body.user_id;

        var result = await requestModel.deleteAllRequestFromUser(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });
    },

    checkRequestTimeElapsed: async (req, res, next) =>{

        var user_id = req.body.user_id;

        var result = await requestModel.checkRequestTimeElapsed(user_id);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    //------> #Admin Config

    createConfig:  async (req, res, next) =>{
        var name = req.params.name;
        var value = req.params.value;

        var result = await configModel.createConfig(name,value);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    findOneConfig: async (req, res, next) =>{
        var name = req.params.name;

        var result = await configModel.findOneConfig(name);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    selectAllConfig: async (req, res, next) =>{

        var result = await configModel.selectAllConfig();

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    },

    updateConfig: async (req, res, next) =>{

        var id = req.params.id;
        var value = req.params.value;

        var result = await configModel.updateConfig(id,value);

        if (result.error) return res.status(401).json({ message: result.error, status:401, data:[] });
        else  return res.status(200).json({ data: result,status:200,message:`success!` });

    }




















};
