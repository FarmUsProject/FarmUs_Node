const { pool } = require('./../../config/database')

async function userbyEmail (email){
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);

    connection.release();

    return userInfo;
}

module.exports = {
    userbyEmail,
};
