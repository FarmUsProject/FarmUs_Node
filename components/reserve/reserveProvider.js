const { pool } = require('./../../config/database');
const reserveDao = require('./reserveDao');

async function farmsbyEmail (userEmail){
    const connection = await pool.getConnection(async conn => conn);
    const [reservedFarms] = await reserveDao.selectReservedFarms(connection, userEmail);

    connection.release();

    return reservedFarms;
}

async function clientsbyFarmID (farmID) {
    const connection = await pool.getConnection(async conn => conn);
    const [reservedClients] = await reserveDao.selectReservedClients(connection, farmID);

    connection.release();

    return reservedClients;
}

module.exports = {
    farmsbyEmail,
    clientsbyFarmID
};
