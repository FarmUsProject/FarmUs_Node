const { pool } = require('../../config/database');
const postDao = require('./postDao');
const {response} = require("../../config/response");
const {SUCCESS} = require("../../config/resStatus");

exports.retrievePosting = async (FarmID, UserName, Comment, Star) => {
    const insertPrams = [FarmID, UserName, Comment, Star];

    const connection = await pool.getConnections(async (conn) => conn);

    const postResult = await postDao.insertPost(
        connection,
        insertPrams
    );
    connection.release();

    return postResult;
}