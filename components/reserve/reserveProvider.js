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

async function itembyReserveId (reserveID) {
    const connection = await pool.getConnection(async conn => conn);
    const [reservedItem] = await reserveDao.selectReservedItem(connection, reserveID);

    connection.release();

    return reservedItem;
}

async function currentUseListByEmail (email) {
    const connection = await pool.getConnection(async conn => conn);
    const [currentUseFarms] = await reserveDao.currentUseList(connection, email);

    connection.release();

    return currentUseFarms;
}

async function pastUseListByEmail (email) {
    const connection = await pool.getConnection(async conn => conn);
    const [pastUseList] = await reserveDao.pastUseList(connection, email);

    connection.release();

    return pastUseList;
}

async function reservedPeriodByFarmID (farmID) {
    const connection = await pool.getConnection(async conn => conn);
    const [reservedPeriods] = await reserveDao.reservedPeriods(connection, farmID);

    connection.release();

    return reservedPeriods;
}

module.exports = {
    farmsbyEmail,
    clientsbyFarmID,
    itembyReserveId,
    currentUseListByEmail,
    pastUseListByEmail,
    reservedPeriodByFarmID,
};
