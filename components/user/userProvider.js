const { pool } = require('../../config/database');
const userDao = require('./userDao');

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

exports.nonSocialUsersbyEmail= async(email)=>{
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectnonSocialUserbyEmail(connection, email);

    connection.release();

    return userInfo;
}
