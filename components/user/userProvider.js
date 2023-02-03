const { pool } = require('./../../config/database')

async function userbyEmail (email){
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);

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
    starListbyEmail
};
