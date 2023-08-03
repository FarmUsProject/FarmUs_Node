const reserveDao = require('./reserveDao');
const withConnection = require('../../config/connection')

exports.farmsbyEmail = withConnection(async (connection, userEmail)=>{
    const [reservedFarms] = await reserveDao.selectReservedFarms(connection, userEmail);
    return reservedFarms;
});

exports.clientsbyFarmID = withConnection(async (connection, farmID)=>{
    const [reservedClients] = await reserveDao.selectReservedClients(connection, farmID);
    return reservedClients;
});

exports.itembyReserveId = withConnection(async (connection, reserveID)=>{
    const [reservedItem] = await reserveDao.selectReservedItem(connection, reserveID);
    return reservedItem;
});

exports.currentUseListByEmail = withConnection(async (connection, email)=>{
    const [currentUseFarms] = await reserveDao.currentUseList(connection, email);
    return currentUseFarms;
})

exports.farmsbyEmail = withConnection(async (connection, email)=>{
    const [pastUseList] = await reserveDao.pastUseList(connection, email);
    return pastUseList;
});

exports.farmsbyEmail = withConnection(async (connection, farmID)=>{
    const [reservedPeriods] = await reserveDao.reservedPeriods(connection, farmID);
    return reservedPeriods;
});