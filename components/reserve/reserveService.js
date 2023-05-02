const reserveProvider = require('./reserveProvider');
const userProvider = require('./../user/userProvider');
const farmProvider = require('./../farm/farmProvider');
const reserveDao = require('./reserveDao');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const { pool } = require('../../config/database');
const setDate = require('./../../helpers/setDate');
const randomNumber = require('../../helpers/randomNumber');
const dateAvailability = require('../../helpers/DateAvailability');

async function request(userEmail, farmid,startAt, endAt) {
    const userInfo = await userProvider.usersbyEmail(userEmail);
    const farmInfo = await farmProvider.farmbyfarmID(farmid);
    const reserveInfo = await reserveProvider.clientsbyFarmID(farmid);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    if (!farmInfo) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);
    
    if(!dateAvailability.isValidDatetype(startAt) || !dateAvailability.isValidDatetype(endAt))
        return errResponse(resStatus_5000.DATE_TYPE_WEIRD);

    const newStartAt = new Date(startAt);
    const newEndAt = new Date(endAt)

    //date availability check
    const unAvailability = await dateAvailability.dateAvailabilityCheck(farmInfo.startAt, farmInfo.endAt, newStartAt, newEndAt);
    console.log(unAvailability);
    if(unAvailability != 0)
    return errResponse(unAvailability);
    
    //date reservation check
    reserveInfo.forEach(e => {
        // console.log("e",e)
        const reservation_full = dateAvailability.reserveAvailabilityCheck(e.startAt, e.endAt, newStartAt, newEndAt);
        if(reservation_full)
            return errResponse(reservation_full);
    });

    //new reserve id
    let newReserveID;
    let existedReserve;

    do {
        newReserveID = await randomNumber.createReserveID();
        existedReserve = await reserveProvider.itembyReserveId(newReserveID);
    } while (!existedReserve);

    //ReserveID, FarmID, UserEmail, OwnerEmail, startAt, endAt, createAt, updateAt
    const now = await setDate.now();
    const newReservationInfo = [newReserveID, farmInfo.FarmID, userEmail, farmInfo.Owner, newStartAt, newEndAt, now, now];

    const connection = await pool.getConnection(async conn => conn);

    const newReservation = await reserveDao.insertReservation(connection, newReservationInfo);

    connection.release();

    return response(resStatus_5000.RESERVE_REQUEST_SUCCESS, null);
};

async function clientsList(farmid) {

    const farmInfo = await farmProvider.farmbyfarmID(farmid);
    if (!farmInfo) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    const reservedClients = await reserveProvider.clientsbyFarmID(farmid);
    if (reservedClients.length < 1) return response(resStatus_5000.RESERVE_LIST_EMPTY);

    return response(resStatus_5000.RESERVE_LIST_CLIENTS, reservedClients);
};

async function farmsList(userEmail) {

    const userInfo = await userProvider.usersbyEmail(userEmail);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const reservedFarms = await reserveProvider.farmsbyEmail(userEmail);
    if (reservedFarms.length < 1) return response(resStatus_5000.RESERVE_LIST_EMPTY);

    return response(resStatus_5000.RESERVE_LIST_FARMS, reservedFarms);
};

async function cancel(reserveId) {

    const reservedItem = await reserveProvider.itembyReserveId(reserveId);
    if (reservedItem.length < 1) return errResponse(resStatus_5000.RESERVE_RESERVEID_NOT_EXIST);

    const connection = await pool.getConnection(async conn => conn);

    const canceledReservation = await reserveDao.cancelReservation(connection, reserveId);

    connection.release();

    return response(resStatus_5000.RESERVE_CANCEL_SUCCESS, {"reserveID" : reserveId});

}

async function editStatus(reserveId, status) {

    const reservedItem = await reserveProvider.itembyReserveId(reserveId);
    if (reservedItem.length < 1) return errResponse(resStatus_5000.RESERVE_RESERVEID_NOT_EXIST);

    const connection = await pool.getConnection(async conn => conn);

    const now = await setDate.now();
    const updatedStatusInfo = [status, now, reserveId];

    const updatedReservation = await reserveDao.editReservationStatus(connection, updatedStatusInfo);

    connection.release();

    switch (status) {
        case 'A':
            return response(resStatus_5000.RESERVE_STATUS_ACCPET_SUCCESS);
        case 'H':
            return response(resStatus_5000.RESERVE_STATUS_HOLD_SUCCESS);
        case 'D':
            return response(resStatus_5000.RESERVE_STATUS_DENIED_SUCCESS);
    }

    return errResponse(resStatus.DB_ERROR);

}

module.exports = {
    request,
    clientsList,
    farmsList,
    cancel,
    editStatus
};