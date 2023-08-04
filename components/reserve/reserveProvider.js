const reserveDao = require('./reserveDao');
const withConnection = require('../../config/connection')
const userProvider = require('./../user/userProvider');
const farmProvider = require('./../farm/farmProvider');
const { response, errResponse } = require('./../../config/response');
const resStatus_5000 = require('../../config/resStatus_5000');

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

exports.pastUseListByEmail = withConnection(async (connection, email)=>{
    const [pastUseList] = await reserveDao.pastUseList(connection, email);
    return pastUseList;
});

exports.reservedPeriodByFarmID = withConnection(async (connection, farmID)=>{
    const [reservedPeriods] = await reserveDao.reservedPeriods(connection, farmID);
    return reservedPeriods;
});

exports.clientsList = async(farmid) => {
    const farmInfo = await farmProvider.farmbyfarmID(farmid);
    if (!farmInfo) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    const reservedClients = await exports.clientsbyFarmID(farmid);
    if (reservedClients.length < 1) return response(resStatus_5000.RESERVE_LIST_EMPTY);

    return response(resStatus_5000.RESERVE_LIST_CLIENTS, reservedClients);
}

exports.farmsList = async(userEmail) => {
    const userInfo = await userProvider.usersbyEmail(userEmail);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const reservedFarms = await exports.farmsbyEmail(userEmail);
    if (reservedFarms.length < 1) return response(resStatus_5000.RESERVE_LIST_EMPTY);

    return response(resStatus_5000.RESERVE_LIST_FARMS, reservedFarms);
}

exports.currentUse = async (email) => {
    const currentUseFarms = await exports.currentUseListByEmail(email);
    if (!currentUseFarms || currentUseFarms.length < 1) return response(resStatus_5000.RESERVE_USE_CURRENT_LIST_EMPTY, null);

    return response(resStatus_5000.RESERVE_USE_CURRENT_LIST, currentUseFarms);
};

exports.pastUse = async (email) => {
    const pastUseFarms = await exports.pastUseListByEmail(email);
    if (!pastUseFarms || pastUseFarms.length < 1) return response(resStatus_5000.RESERVE_USE_PAST_LIST_EMPTY, null);

    return response(resStatus_5000.RESERVE_USE_PAST_LIST, pastUseFarms);
};

exports.unbookablePeriods = async (farmID) => {
    let reservedPeriods = await exports.reservedPeriodByFarmID(farmID);
    if (!reservedPeriods || reservedPeriods.length < 1) reservedPeriods = null;

    return response(resStatus_5000.RESERVE_UNBOOKABLE_PERIOD, reservedPeriods);
};