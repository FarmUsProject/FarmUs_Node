// Provider: Read 비즈니스 로직 처리
const { pool } = require("../../config/database");
const userDao = require("./userDao");

exports.retrieveUserEmail = async function (userEmail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const res = await userDao.selectUserEmail(connection, userEmail);

    connection.release();

    return res[0];
};

exports.retrieveUser = async (name, phoneNumber) =>{
    const connection = await pool.getConnection(async (conn) => conn);
    const res = await userDao.selectUser(connection, name, phoneNumber);

    connection.release();

    return res[0];
}