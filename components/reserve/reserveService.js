const reserveProvider = require('./../reserve/reserveProvider');
const userProvider = require('./../user/userProvider');
const farmProvider = require('./../farm/farmProvider');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const { pool } = require('../../config/database');

async function request(userEmail, farmid) {
    const userInfo = await userProvider.userbyEmail(userEmail);
    const farmInfo = await farmProvider.farmbyfarmID(farmid);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    if (farmInfo.length < 1) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    //userEmail, FarmID, OwnerEmail, Term, (createAt, updateAt : DAO에서 시간지정)
    const newReservationInfo = [userEmail, farmInfo.farmID, farmInfo.owner, farmInfo.term];

    const connection = await pool.getConnection(async conn => conn);
    const newReservation = await reserveDao.insertReservation(connection, newReservationInfo);

    connection.release();

    return response(resStatus_5000.RESERVE_REQUEST_SUCCESS, null);
};


module.exports = {
    request,
};