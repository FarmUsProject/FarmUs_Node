const { pool } = require('./database');

const withConnection = (handler) => async (...args) => {
    const connection = await pool.getConnection(async (conn)=>conn);
    try{
        return await handler(connection, ...args)
    }finally{
        connection.release();
    }
}

module.exports = withConnection;