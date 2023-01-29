const { pool } = require("../../config/database");
const farmDao = require('./farmDao')

exports.retrieveFarms = async(keyword) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const newKeyword = '%'+keyword+'%'
    const res = await farmDao.searchFarm(connection, newKeyword)

    connection.release()

    return res
}