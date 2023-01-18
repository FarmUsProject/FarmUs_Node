const mysql = require('mysql2/promise');
const {logger} = require('./winston');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'farmus',
    port: '3306',
    password: 'farmus',
    database: 'farmus'
});

module.exports = {
    pool: pool
};