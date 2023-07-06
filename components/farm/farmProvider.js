const { pool } = require('./../../config/database');
const farmDao = require('./farmDao');

exports.retrieveFarmlist = async () =>{
    const connection  = await pool.getConnection(async (conn) => conn);
    const farmListResult =  await farmDao.selectFarm(connection);
    connection.release();

    return farmListResult;
}

exports.retrieveFarmInfo = async (farmID) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const farmInfo = await farmDao.selectFarmbyFarmID(connection, farmID);

    connection.release();

    return farmInfo[0];
}

exports.retrieveUsedFarmDetail = async (UsedArray) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const UsedFarmDetail = await farmDao.selectUsedFarmDetail(connection, UsedArray);
    connection.release();

    return UsedFarmDetail;
}

exports.retrieveUseFarmDetail = async (UsedArray) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const UseFarmDetail = await farmDao.selectUseFarmDetail(connection, UsedArray);
    connection.release();

    return UseFarmDetail;
}

exports.farmbyfarmID =async(farmID) =>{
    const connection = await pool.getConnection(async conn => conn);
    const [farmInfo] = await farmDao.selectFarmbyFarmID(connection, farmID);

    connection.release();

    return farmInfo[0];
}

exports.isSameFarm = async(farmInfo)=>{
    const connection = await pool.getConnection(async conn => conn);
    const [sameFarm] = await farmDao.selectFarmbyFarmInfo(connection, farmInfo);
    connection.release();

    if (sameFarm.length > 0)  return true;
    else false;

}

// 농장 검색관련
exports.retrieveFarms = async(keyword) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const newKeyword = '%'+keyword+'%'
    const res = await farmDao.searchFarm(connection, newKeyword)

    connection.release()

    return res
}

exports.farmPictureUrlbyFarmID = async (farmID) =>{
    const connection = await pool.getConnection(async conn => conn);
    const farmPicturesInfo = await farmDao.selectFarmPicturesUrlbyFarmID(connection, farmID);

    connection.release();

    return farmPicturesInfo[0];
}

exports.farmPictureUrl = async () =>{
    const connection = await pool.getConnection(async conn => conn);
    const farmPicturesInfo = await farmDao.selectFarmPicturesUrlKey(connection);

    connection.release();

    return farmPicturesInfo[0];
}