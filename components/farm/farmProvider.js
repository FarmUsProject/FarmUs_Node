const { pool } = require('../../config/database');
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