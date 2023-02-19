const { pool } = require('../../config/database');
const userDao = require('./userDao');

exports.retrieveUsedFarmArray = async (userid) =>{
    const connection  = await pool.getConnections(async (conn) => conn);
    const UsedFarmArray =  await userDao.SelectionUsedFarmArray(connection, userid);
    connection.release();

    return UsedFarmArray;
}

exports.retrieveCurFarmArray = async (userid) =>{
    const connection  = await pool.getConnections(async (conn) => conn);
    const UseFarmArray =  await userDao.SelectionUseFarmArray(connection, userid);
    connection.release();

    return UseFarmArray;
}

