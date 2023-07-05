const { pool } = require('../../config/database');
const postDao = require('./postDao');


exports.retrievePostings = async (FarmID) => {
    const connection = await pool.getConnections(async (conn) => conn);

    const farmPostings = await postDao.selectFarmPostings(connection, FarmID);
    connection.release();

    return farmPostings;
}

exports.postUpload = async(farmInfo) =>{
    const connection = await pool.getConnection(async (conn) => conn);
    const post = await postDao.insertPost(connection,farmInfo)
    connection.release();

    return post
}
