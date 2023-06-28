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

exports.retrieveUserEmail = async function (userEmail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [res] = await userDao.selectUserbyEmail(connection, userEmail);

    connection.release();

    return res[0];
};

exports.retrieveUser = async (phoneNumber) =>{
    const connection = await pool.getConnection(async (conn) => conn);
    const res = await userDao.selectUser(connection, phoneNumber);

    connection.release();

    return res[0];
}

exports.usersbyEmail= async(email)=>{
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);

    connection.release();

    return userInfo;
}

exports.userbyPhoneNumber = async(phoneNumber)=>{
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyPhoneNumber(connection, phoneNumber);

    connection.release();

    return userInfo;
}

exports.starListbyEmail = async(email)=>{
    const connection = await pool.getConnection(async conn => conn);
    const [starByEmail] = await userDao.selectStarbyEmail(connection, email);

    connection.release();

    return starByEmail;
}

