const randomNumber = require('../../helpers/randomNumber');
const FarmProvider = require('./farmProvider');
const { pool } = require('../../config/database');
const farmDao = require('./farmDao');

async function newFarm(name, owner, picture_url, price, squaredMeters, location, description) {
    let newFarmID;
    let existedFarm;
    do {
        newFarmID = await randomNumber.createFarmID();
        existedFarm = await FarmProvider.farmbyfarmID(farmID);
    } while (existedFarm);
    const newFarmInfo = [newFarmID, name, owner, picture_url, price, squaredMeters, location, description];
    const connection = await pool.getConnection(async conn => conn);
    const newFarm = await farmDao.insertFarm(connection, newFarmInfo);

    connection.release();

    return response(true, 200, "농장이 등록되었습니다", null);
}


module.exports = {
    newFarm,
};