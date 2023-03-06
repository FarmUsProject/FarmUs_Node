const { pool } = require('./../../config/database');
const farmDao = require('./farmDao');

exports.retrieveFarmlist = async () =>{
    const connection  = await pool.getConnections(async (conn) => conn);
    const farmListResult =  await farmDao.selectFarm(connection);
    connection.release();

    return farmListResult;
}

exports.retrieveFarmDetail = async (Farmidx) => {
    const connection = await pool.getConnections(async (conn) => conn);

    const farmDetail = await farmDao.selectFarmDetail(connection, Farmidx);
    connection.release();

    return farmDetail;
}

exports.retrieveUsedFarmDetail = async (UsedArray) => {
    const connection = await pool.getConnections(async (conn) => conn);

    const UsedFarmDetail = await farmDao.selectUsedFarmDetail(connection, UsedArray);
    connection.release();

    return UsedFarmDetail;
}

exports.retrieveUseFarmDetail = async (UsedArray) => {
    const connection = await pool.getConnections(async (conn) => conn);

    const UseFarmDetail = await farmDao.selectUseFarmDetail(connection, UsedArray);
    connection.release();

    return UseFarmDetail;
}

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

exports.retrieveFarms = async(keyword) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const newKeyword = '%'+keyword+'%'
    const res = await farmDao.searchFarm(connection, newKeyword)

    connection.release()

    return res
}

module.exports = {
    farmbyfarmID,
    isSameFarm,
};
