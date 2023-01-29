const FarmProvider = require('./farmProvider');
const farmDao = require('./farmDao');
const { pool } = require('../../config/database');
const {response, errResponse} = require('./../../config/response');
const resStatus_5000 = require('./../../config/resStatus_5000');
const randomNumber = require('../../helpers/randomNumber');
const setDate = require('./../../helpers/setDate');

async function newFarm(name, owner, term, price, squaredMeters, location, description, picture_url, category, tag) {
    const newFarmStatus = 'A';
    let newFarmID;
    let existedFarm;
    do {
        newFarmID = await randomNumber.createFarmID();
        existedFarm = await FarmProvider.farmbyfarmID(newFarmID);
    } while (!existedFarm); //farmID

    const now = await setDate.now();
    const newFarmInfo = [newFarmID, name, owner, term, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus, now, now];

    const isSameFarm = await FarmProvider.isSameFarm(newFarmInfo); //중복체크
    if (isSameFarm) return errResponse(resStatus_5000.FARM_DUPLICATED_EXISTS);
    const connection = await pool.getConnection(async conn => conn);
    const newFarm = await farmDao.insertFarm(connection, newFarmInfo);

    connection.release();

    return response(resStatus_5000.FARM_NEW_SAVE_SUCCESS, {"newFarmID" : newFarmID});
}


module.exports = {
    newFarm,
};