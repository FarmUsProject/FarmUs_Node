const farmProvider = require('./farmProvider');
const User = require('../user/userProvider');
const Responce = require('../../config/response');
const { pool } = require('../../config/database');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM, USER_USERID_EMPTY, SUCCESS} = require("../../config/resStatus");
const farmService = require("./farmService");


exports.getFarmlist = async (req, res) => {
    const getFarmResult = await farmProvider.retrieveFarmlist();
    return res.render(response(resStatus.SUCCESS, getFarmResult));
}

exports.getFarmDetail = async (req, res) => {
    const { Farmidx } = req.params;

    if(!Farmidx) return res.render(errResponse(FARMID_EMPTY));

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
