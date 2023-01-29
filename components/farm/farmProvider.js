const { pool } = require('./../../config/database');
const farmDao = require('./farmDao');

async function farmbyfarmID (farmID){
    const connection = await pool.getConnection(async conn => conn);
    const [farmInfo] = await farmDao.selectFarmbyFarmID(connection, farmID);

    connection.release();

    return farmInfo[0];
}

async function isSameFarm (farmInfo){
    const connection = await pool.getConnection(async conn => conn);
    const [sameFarm] = await farmDao.selectFarmbyFarmInfo(connection, farmInfo);
    connection.release();

    if (sameFarm.length > 0)  return true;
    else false;

}


module.exports = {
    farmbyfarmID,
    isSameFarm,
};
