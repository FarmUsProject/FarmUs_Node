const farmProvider = require('./farmProvider');
const farmService = require('./farmService');
const User = require('../user/userProvider');
const { response, errResponse} = require("../../config/response");
const resStatus = require('../../config/resStatus');
const baseResponse = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM, USER_USERID_EMPTY, SUCCESS} = require("../../config/resStatus");
const validator = require('./../../helpers/validator');
const { response2, errResponse2 } = require('./../../config/response2');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./../../config/secret');
const resStatus_5000 = require('../../config/resStatus_5000');
const districtClarity = require('./../../helpers/districtClarity');
const dateAvailability = require('../../helpers/DateAvailability');
const userProvider = require('../user/userProvider');
const jwtLogin = require('./../../config/jwtLogin');

exports.getFarmlist = async (req, res) => {
    try{
        const email = req.params.email;
        const invalidation = await validator.oneParams(email);

        if (invalidation) return (res.send(response(invalidation)));

        const FarmListResponse = await farmService.getFarmList(email);

        // console.log(FarmDetailResponse)
        return res.send(FarmListResponse);
    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.getFarmDetail = async (req, res) => {
    try {
        const farmID = req.params.farmid;
        const invalidation = await validator.oneParams(farmID);

        if (invalidation) return (res.send(response(invalidation)));

        const FarmDetailResponse = await farmService.getFarmDetail(farmID);

        return res.send(FarmDetailResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.getFarmUsedList = async (req, res) => {
    const { userid } = req.params;

    if(!userid) return res.render(errResponse(USER_USERID_EMPTY));

    const FarmUsedArray = User.retrieveUsedFarmArray(userid);
    const getUsedFarm_Detail = await farmProvider.retrieveFarmDetail(FarmUsedArray);
    return res.render(getUsedFarm_Detail);

}

exports.getFarmUseList = async (req, res) => {
    const { userid } = req.params;
    if(!userid) return res.render(errResponse(USER_USERID_EMPTY));

    const FarmUseArray = User.retrieveCurFarmArray(userid);
    const getUseFarm_Detail = await farmProvider.retrieveUseFarmDetail(FarmUseArray);
    return res.render(getUseFarm_Detail);

}

exports.postFarmer = async (req, res) =>{
    try{
        const decoded = jwt.verify(req.headers.token, secretKey);
        //console.log("decoded")
        //console.log(decoded);
        //console.log("======");
        if (decoded.role == 'F') return res.send(errResponse2(baseResponse.ALREADY_FARMER));

        const farmer = await farmService.postFarmer(decoded.email);
        if (!farmer) return res.send(errResponse2(baseResponse.SIGNIN_INACTIVE_ACCOUNT))

        const userInfo = await userProvider.retrieveUserEmail(decoded.email);
        const newJwtResponse = await jwtLogin(userInfo)
/*
        const decoded2 = jwt.verify(newJwtResponse.accesstoken, secretKey)
        console.log("decoded2")
        console.log(decoded2);
        console.log("======");
        */
        baseResponse.SUCCESS.accesstoken = newJwtResponse.accesstoken

        return res.send(baseResponse.SUCCESS);

    }catch(err){
        console.log(err);
        return res.send(errResponse2(baseResponse.NOT_LOGIN));
    }

}

exports.editFarm = async(req, res) =>{
    try{
        const {farmId} = req.query;

        if (!farmId) return res.send(errResponse2(baseResponse.FARMID_EMPTY))

        const eidtFarmInfoRes = await farmService.editFarmInfo(farmId, req.body)
        console.log(eidtFarmInfoRes);
        if (!eidtFarmInfoRes.affectedRows) return res.send(errResponse2(baseResponse.WRONG_FARMID))

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const location = file.location;
            const key = file.key;
            const editFarmPicturesRes = await farmService.editFarmPictures(farmId,location, key);
        }
        return res.send(response2(baseResponse.SUCCESS));

    }catch(err){
        return res.send(err)
    }

}

/**
 * [POST] /farm/postings
 */
exports.newFarm = async function (req, res) {
    try {
        const { name, owner, price, squaredMeters, locationBig, locationMid, locationSmall, description} = req.body;
        //console.log(req);
        console.log(req.body);
        const invalidation = await validator.newFarm(name, owner, price, squaredMeters, locationBig, locationMid);

        if (invalidation) return res.send(errResponse(invalidation))

        // Date Availability 유효성 검사
        // if (dateAvailability.isValidDatetype(startDate) == false || dateAvailability.isValidDatetype(endDate) == false)
        //     return res.send(errResponse(resStatus_5000.DATE_TYPE_WEIRD));
        // const farmDateErrorMessage = dateAvailability.validFarmDate(new Date(), new Date(startDate), new Date(endDate))
        // if(farmDateErrorMessage != true)
        //     return res.send(errResponse(farmDateErrorMessage));

        const userInfo = await userProvider.usersbyEmail(owner);
        if (!userInfo || userInfo.length < 1) return res.send(errResponse(resStatus.USER_USEREMAIL_NOT_EXIST));

        if(userInfo[0].Role.toUpperCase() != 'F') return res.send(errResponse(resStatus_5000.USER_NOT_FARMER));


        const districtClarityResponse = await districtClarity.checkLocation(locationBig, locationMid, locationSmall);

        if(!districtClarityResponse.result) return res.send(districtClarityResponse);

        const districtCode = districtClarityResponse.result;

        let newFarmResponse = await farmService.newFarm(name, owner, price, squaredMeters, locationBig, locationMid, locationSmall, description);
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const location = file.location;
            const key = file.key;
            const editFarmPicturesRes = await farmService.editFarmPictures(newFarmResponse.result.newFarmID,location, key);
        }

        if (newFarmResponse.result)
            newFarmResponse.result = {"newFarmID" : newFarmResponse.result.newFarmID, "districtCode" : districtCode};
        return res.send(newFarmResponse)

    }
    catch (e) {
        console.log(e);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.findFarms = async (req,res) => {
    try{
        const {keyword} = req.query
        if (!keyword) return res.send(errResponse2(baseResponse.FARM_NOT_KEYWORD))

        const farms = await farmProvider.retrieveFarms(keyword)
        const searchRes = {"result" : true}
        searchRes.farms = farms
        return res.send(searchRes)
    }catch(err){
        console.log(err);
    }

}

exports.filter = async(req,res) => {
    try{
        const {locationBig, locationMid} = req.query
        if (!locationBig)
            return res.send(errResponse2(baseResponse.SET_REGION))

        const searchRes = {"result" : true}
        const farms = await farmProvider.farmFilter(locationBig, locationMid)
        searchRes.farms = farms

        return res.send(searchRes)

    }catch (e) {
        console.log(e);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.deletePhoto = async(req,res) => {
    try{
        const {Picture_key} = req.body
        if (!Picture_key) return res.send(errResponse2(baseResponse.EMPTY_PICTURE_KEY))

        const [deleteRes] = await farmProvider.deletePhoto(Picture_key)
        if (deleteRes.affectedRows)
            return res.send(response2(baseResponse.SUCCESS))

        return res.send(errResponse2(baseResponse.ALREADY_DELETE_PICTURE))

    }catch (e) {
        console.log(e);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.getPhoneNumber = async(req,res) => {
    try{
        const {farmID} = req.query
        if (!farmID) return res.send(errResponse2(baseResponse.FARMID_EMPTY))

        const Owner = await farmProvider.getOwner(farmID)
        Owner.result = true
        return res.send(Owner)
    }catch(e){
        console.log(e);
        res.send(errResponse(resStatus.INACCURATE_OWNER));
    }
}

exports.getLikes = async(req,res) =>{
    try{
        const {email} = req.query
        if (!email) return res.send(errResponse2(baseResponse.SIGNUP_EMAIL_EMPTY))

        const user = await userProvider.retrieveUserEmail(email)
        console.log(user);
        if (!user.LikeFarmIDs) return res.send([])

        const likesArray = user.LikeFarmIDs.split(',').map(item => item.trim());
        const likeFarms = await farmProvider.getFarmArray(likesArray)

        return res.send(likeFarms)
    }catch(e){
        console.log(e);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}