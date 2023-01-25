const farmProvider = require('./farmProvider');
const User = require('../user/userProvider');
const Responce = require('../../config/response');
const { pool } = require('../../config/database');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM, USER_USERID_EMPTY, SUCCESS} = require("../../config/resStatus");

exports.getFarmlist = async (req, res) => {
    const getFarmResult = await farmProvider.retrieveFarmlist();
    return res.render(response(resStatus.SUCCESS, getFarmResult));
}

exports.getFarmDetail = async (req, res) => {
    const { Farmidx } = req.body;

    if(!Farmidx) return res.render(errResponse(FARMID_EMPTY));

    const getFarmDetail = await farmProvider.retrieveFarmDetail(Farmidx);
    if(!getFarmDetail.Status) return res.render(errResponse(DELETED_FARM));
    return res.render(response(resStatus.SUCCESS, getFarmDetail));
}

exports.getFarmUsedList = async (req, res) => {
    const userid  = req.body;

    if(!userid) return res.render(errResponse(USER_USERID_EMPTY));

    const FarmUsedArray = User.retrieveUsedFarmArray(userid);
    const getUsedFarm_Detail = await farmProvider.retrueveUsedFarmDetail(FarmUsedArray);
    return res.render(response(resStatus,SUCCESS, getUsedFarm_Detail));



}

exports.getFarmUseList = async (req, res) => {
    const userid  = req.body;

    if(!userid) return res.render(errResponse(USER_USERID_EMPTY));

    const FarmUseArray = User.retrieveCurFarmArray(userid);
    const getUseFarm_Detail = await farmProvider.retrueveUseFarmDetail(FarmUseArray);
    return res.render(response(resStatus,SUCCESS, getUseFarm_Detail));



}