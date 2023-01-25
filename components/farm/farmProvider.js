const { pool } = require('./../../config/database');
const farmDao = require('./farmDao');

async function farmbyfarmID (farmID){
    const connection = await pool.getConnection(async conn => conn);
    const [farmInfo] = await farmDao.selectFarmbyFarmID(connection, farmID);

    connection.release();

    return farmInfo;
}

async function bookedFarm () {

}

module.exports = {
    farmbyfarmID,
    bookedFarm,
};
