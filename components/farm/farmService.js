const { pool } = require('../../config/database');
const farmDao = require('./farmDao');
const {response} = require("../../config/response");
const {SUCCESS} = require("../../config/resStatus");

exports.Changeto_Owner = async (userid) => {
    const User = userid;

    const connection = await pool.getConnections(async (conn) => conn);

    const UserStatus_ChangeResult = await farmDao.ChangeUser_Status(
        connection,
        User
    );
    connection.release();

    return UserStatus_ChangeResult;

}