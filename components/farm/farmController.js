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
const { secretKey } = require('./../../config/secret')

exports.getFarmlist = async (req, res) => {
    const getFarmResult = await farmProvider.retrieveFarmlist();
    return res.render(response(resStatus.SUCCESS, getFarmResult));
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
        if (decoded.role == 'F') return res.send(errResponse2(baseResponse.ALREADY_FARMER));
        console.log(decoded);

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
        const {farmId, name} = req.query;
        if (!farmId) return res.send(errResponse2(baseResponse.FARMID_EMPTY))
        if (!name) return res.send(errResponse2(baseResponse.FARM_NAME_EMPTY))

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
            editFarmPicturesRes = await farmService.editFarmPictures(farmId, name, location, key);
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
        const { name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag } = req.body;
        const invalidation = await validator.newFarm(name, owner, startDate, endDate, price, squaredMeters, location);

        if (invalidation) return res.send(errResponse(invalidation))

        const newFarmResponse = await farmService.newFarm(name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag);

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
