const FarmProvider = require('./farmProvider');
const farmDao = require('./farmDao');
const { pool } = require('../../config/database');
const { response, errResponse } = require('./../../config/response');
const resStatus_5000 = require('./../../config/resStatus_5000');
const randomNumber = require('../../helpers/randomNumber');
const setDate = require('./../../helpers/setDate');
const { response2, errResponse2 } = require('../../config/response2');
const baseResponse = require('../../config/resStatus');
const { eidtFarm } = require('./farmController');
const resStatus = require('../../config/resStatus');
const userProvider = require('./../user/userProvider');


exports.postFarmer = async (email) => {
    const connection = await pool.getConnection(async (conn)=>conn)
    const res = await farmDao.userToFarmer(connection, email)
    connection.release()

    return res;
}

exports.newFarm = async (name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall, description, category, tag) => {
    const newFarmStatus = 'A';
    let newFarmID;
    let existedFarm;
    do {
        newFarmID = await randomNumber.createFarmID();
        existedFarm = await FarmProvider.farmbyfarmID(newFarmID);
    } while (existedFarm); //unique farmID

    const now = await setDate.now();
    const newFarmInfo = [newFarmID, name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall, description, category, tag, newFarmStatus, now, now];

    const isSameFarm = await FarmProvider.isSameFarm(newFarmInfo); //중복체크
    if (isSameFarm) return errResponse(resStatus_5000.FARM_DUPLICATED_EXISTS);

    const connection = await pool.getConnection(async conn => conn);

    const newFarm = await farmDao.insertFarm(connection, newFarmInfo);

    connection.release();

    return response(resStatus_5000.FARM_NEW_SAVE_SUCCESS, { "newFarmID": newFarmID });
}

exports.deleteUserFarm = async(email) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await farmDao.withdrawalUserFarm(connection, email)

        connection.release()

        if (res) return response2(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}
exports.editFarmInfo = async(farmID, farmInfo) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await farmDao.eidtMyFarm(connection, farmID, farmInfo)
        connection.release()

        return response2(baseResponse.SUCCESS)
    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

exports.editFarmPictures = async(farmID, img, key) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await farmDao.editFarmPicture(connection, farmID, img, key)
        connection.release()

        return response2(baseResponse.SUCCESS)
    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

//추가할 사진 정보 : farm 테이블의 사진, user 테이블의 사진
exports.getFarmDetail = async (farmID) => {
    try {

        const farmInformation = await FarmProvider.retrieveFarmInfo(farmID);
        const userInformation = await userProvider.usersbyEmail(farmInformation[0].Owner);

        //최종 농장 세부사항
        let farmDetail = farmInformation[0];

        //농장 항목 삭제 : Owner, crateAt, updateAt
        delete farmDetail.Owner;
        delete farmDetail.createAt;
        delete farmDetail.updateAt;

        //농장주 정보 추가 : Email, PhoneNumber, Name, NickName
        let userInfo = {
            Email : userInformation[0].Email,
            PhoneNumber : userInformation[0].PhoneNumber,
            Name : userInformation[0].Name,
            NickName : userInformation[0].NickName
        }
        farmDetail.farmer = userInfo;

        /**
         * 농장 사진과 농장주 사진 farmDetail에 추가할 필요 있음!
         * 사진 파일 추가 전  farmDetail예시는 API 명세서 참고
         */

        return response(resStatus_5000.FARM_DETAIL_GET_SUCCESS, farmDetail);

    } catch(err) {
        return errResponse(resStatus.DB_ERROR);
    }
}