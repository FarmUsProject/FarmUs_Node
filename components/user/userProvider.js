const { pool } = require('./../../config/database')
const userDao = require('./userDao');

async function userbyEmail (email){
    const connection = await pool.getConnection(async conn => conn);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);

    connection.release();

    return userInfo;
}

module.exports = {
    userbyEmail,
};
