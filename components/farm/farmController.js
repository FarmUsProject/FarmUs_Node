const farmProvider = require('./farmProvider');
const farmService = require("./farmService");
const User = require('../user/userProvider');
const { response, errResponse} = require("../../config/response");
const resStatus = require('../../config/resStatus');
const baseResponse = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM, USER_USERID_EMPTY, SUCCESS} = require("../../config/resStatus");
const validator = require('./../../helpers/validator');
const { response2, errResponse2 } = require('./../../config/response2');

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

exports.register_FarmOwner = async (req, res) =>{
    const { userid }= req.params;

    if(!userid) return res.render(errResponse(USER_USERID_EMPTY));

    const Register_Owner = await farmService.Changeto_Owner(userid);

    return res.render(Register_Owner);

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
    const {keyword} = req.query

    if (!keyword) return res.send(errResponse2(baseResponse.FARM_NOT_KEYWORD))

    const farms = await farmProvider.retrieveFarms(keyword)
    return res.send(farms)
}
