const { pool } = require('./../../config/database')
const userDao = require('./userDao');

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
