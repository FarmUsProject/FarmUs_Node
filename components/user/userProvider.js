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

async function userbyEmail (email){
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);

    connection.release();

    return userInfo;
}

async function userbyPhoneNumber (phoneNumber){
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyPhoneNumber(connection, phoneNumber);

    connection.release();

    return userInfo;
}

async function starListbyEmail (email){
    const connection = await pool.getConnection(async conn => conn);
    const [starByEmail] = await userDao.selectStarbyEmail(connection, email);

    connection.release();

    return starByEmail;
}

module.exports = {
    userbyEmail,
    userbyPhoneNumber,
    starListbyEmail
};