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


exports.Changeto_Owner = async (userid) => {
    const User = userid;

    const connection = await pool.getConnections(async (conn) => conn);

    const UserStatus_ChangeResult = await farmDao.ChangeUser_Status(
        connection,
        User
    );
    connection.release();

    return UserStatus_ChangeResult;

}

async function newFarm(name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag) {
    const newFarmStatus = 'A';
    let newFarmID;
    let existedFarm;
    do {
        newFarmID = await randomNumber.createFarmID();
        existedFarm = await FarmProvider.farmbyfarmID(newFarmID);
    } while (!existedFarm); //farmID

    const now = await setDate.now();
    const newFarmInfo = [newFarmID, name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus, now, now];

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
        console.log(farmID);
        const res = await farmDao.eidtMyFarm(connection, farmID, farmInfo)
        connection.release()

        if(res)
            return response2(baseResponse.SUCCESS)
    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}
/*
module.exports = {
    newFarm,
    Changeto_Owner,
    deleteUserFarm,
    editFarmInfo
};
*/