const mysql = require('mysql2/promise');
const {DB_ENV} = require('../config/secret')

const pool = mysql.createPool({
    host: DB_ENV.HOST,
    user: DB_ENV.USER,
    port: DB_ENV.PORT,
    password: DB_ENV.PASSWORD,
    database: DB_ENV.DATABASE,
});

module.exports = {
    pool: pool
};