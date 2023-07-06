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

exports.getFarmlist = async (req, res) => {
    try{
        const getFarmResult = await farmProvider.retrieveFarmlist();
        return res.send(response(resStatus_5000.FARM_LIST_AVAILABLE_FOR_RESERVATION, getFarmResult));
    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.getFarmDetail = async (req, res) => {
    const { farmid } = req.params;

    if(!farmid) return res.render(errResponse(FARMID_EMPTY));

    const getFarmDetail = await farmProvider.retrieveFarmDetail(Farmidx);
    return res.render(response(resStatus.SUCCESS, getFarmDetail));
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
        console.log(decoded);
        if (decoded.role == 'F') return res.send(errResponse2(baseResponse.ALREADY_FARMER));

        const farmer = await farmService.postFarmer(decoded.email);
        if (!farmer) return res.send(response2(baseResponse.SIGNIN_INACTIVE_ACCOUNT))

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

        // req.files의 originalname
        /*
        const locations = req.files.map(file => file.location);
        const keys = req.files.map(file => file.key);

        console.log("Locations:", locations);
        console.log("Keys:", keys);
        */
       if (!eidtFarmInfoRes.result) return res.send(eidtFarmInfoRes)

        let editFarmPicturesRes;
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const location = file.location;
            const key = file.key;
            editFarmPicturesRes = await farmService.editFarmPictures(farmId,location, key);
            if (!editFarmPicturesRes.result) break
        }
        return res.send(editFarmPicturesRes);
    }catch(err){
        return res.send(err)
    }

}

/**
 * [POST] /farm/postings
 */
exports.newFarm = async function (req, res) {
    try {
        const { name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall,description, category, tag } = req.body;

        const invalidation = await validator.newFarm(name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid);
        if (invalidation) return res.send(errResponse(invalidation))
        if (dateAvailability.isValidDatetype(startDate) == false || dateAvailability.isValidDatetype(endDate) == false)
            return res.send(errResponse(resStatus_5000.DATE_TYPE_WEIRD));

        const farmDateErrorMessage = dateAvailability.validFarmDate(new Date(), new Date(startDate), new Date(endDate))
        if(farmDateErrorMessage != true)
            return res.send(errResponse(farmDateErrorMessage));

        const userInfo = await userProvider.usersbyEmail(owner);
        if (!userInfo || userInfo.length < 1) return res.send(errResponse(resStatus.USER_USEREMAIL_NOT_EXIST));

        if(userInfo[0].Role.toUpperCase() != 'F') return res.send(errResponse(resStatus_5000.USER_NOT_FARMER));


        const districtClarityResponse = await districtClarity.checkLocation(locationBig, locationMid, locationSmall);

        if(!districtClarityResponse.result) return res.send(districtClarityResponse);

        const districtCode = districtClarityResponse.result;

        let newFarmResponse = await farmService.newFarm(name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall, description, category, tag);
        if (newFarmResponse.result)
            newFarmResponse.result = {"newFarmID" : newFarmResponse.result.newFarmID, "districtCode" : districtCode};
        return res.send(newFarmResponse)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.findFarms = async (req,res) => {
    try{
        const {keyword} = req.query

        if (!keyword) return res.send(errResponse2(baseResponse.FARM_NOT_KEYWORD))

        const farms = await farmProvider.retrieveFarms(keyword)
        return res.send(farms)
    }catch(err){
        console.log(err);
    }

}
