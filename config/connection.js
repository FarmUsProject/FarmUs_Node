const { pool } = require('./database');
const baseResponse = require('./resStatus')
const {errResponse2} = require('./response2')

const withConnection = (handler) => async (...args) => {
    const connection = await pool.getConnection(async (conn)=>conn);
    try{
        return await handler(connection, ...args)
    }catch(err){
        console.log(err);
        throw errResponse2(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

module.exports = withConnection;