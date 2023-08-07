const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");
const reserveService = require("./reserveService");
const reserveProvider = require('./reserveProvider')
const resStatus_5000 = require('../../config/resStatus_5000');
const dateAvailability = require('../../helpers/DateAvailability');
const { errResponse2 } = require('../../config/response2');
const baseResponse = require('../../config/resStatus');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./../../config/secret');
const farmProvider = require('./../farm/farmProvider')

/**
 * [POST] /reserve/request
 */
exports.request = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);
    try {
        const { farmid, startDate, endDate } = req.body;
        const invalidation = await validator.newReservation(decoded.email, farmid, startDate, endDate);

        if (invalidation) return(res.send(errResponse(invalidation)));

        if(dateAvailability.isValidDatetype(startDate) == false || dateAvailability.isValidDatetype(endDate) == false)
            return(res.send(errResponse(resStatus_5000.DATE_TYPE_WEIRD)));

        const reserveRequest_result = await reserveService.request(decoded.email, farmid, startDate, endDate);

        return(res.send(reserveRequest_result));

    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }
}

/**
 * [GET] /reserve/farm/list/:farmid
*/
exports.clientsList = async function (req, res) {
    try {
    const farmid = req.params.farmid;
    const invalidation = await validator.oneParams(farmid);

    if (invalidation) return(res.send(response(invalidation)));

    const clientsListResponse = await reserveProvider.clientsList(farmid);

    return(res.send(clientsListResponse));

    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }
}

/**
 * [GET] /reserve/client/list/:email
*/
exports.farmsList = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);
    try {

        const userEmail = decoded.email;
        const invalidation = await validator.oneParams(userEmail);

        if (invalidation) return(res.send(response(invalidation)));

        const farmsListResponse = await reserveProvider.farmsList(userEmail);

        return(res.send(farmsListResponse));

    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }
}

/**
 * [PUT] /reserve/cancel/:reserveid
*/
exports.cancel = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);
    try {

        const reserveId = req.params.reserveid;
        const invalidation = await validator.oneParams(reserveId);

        if (invalidation) return(res.send(response(invalidation)));

        const cancelReservation = await reserveService.cancel(reserveId, decoded.email);

        return(res.send(cancelReservation));

    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }
}

/**
 *  [PUT] /reserve/:status/:reserveid
 */
exports.editStatus = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);
    try {
        let status = req.params.status;
        status = status.toUpperCase();

        const reserveId = req.params.reserveid;
        console.log(reserveId);
        const reservedItem = await reserveProvider.itembyReserveId(reserveId);
        console.log(reservedItem);
        if (reservedItem.length < 1) return errResponse(resStatus_5000.RESERVE_RESERVEID_NOT_EXIST);
        if (reservedItem[0].OwnerEmail != decoded.email) return res.send(errResponse(baseResponse.WRONG_RESERVE_USER));

        switch (status) {
            case "ACCEPT":
                status = "A";
                break;
            case "DENIED":
                status = "D";
                break;
            case "HOLD":
                status = "H";
                break;
            default :
                return (res.send(errResponse(resStatus_5000.RESERVE_STATUS_ERROR)));
        }

        const invalidation = await validator.twoParams(reserveId, status);

        if (invalidation) return (res.send(errResponse(invalidation)));

        const editStatusResult = await reserveService.editStatus(reserveId, status);

        return(res.send(editStatusResult));

    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }

}

/**
 *  [GET] /reserve/current/list/:email
 */
exports.currentUse = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);

    try {
        let userEmail = decoded.email;
        // const invalidation = await validator.oneParams(userEmail);
        // if (invalidation) return (res.send(errResponse(invalidation)));

        if(validator.isValidEmail(userEmail) == false)
            return res.send(errResponse(resStatus.SIGNIN_EMAIL_ERROR_TYPE));

        const currentUseResult = await reserveProvider.currentUse(userEmail);

        return(res.send(currentUseResult));
    }
    catch (e) {
        console.log(e);
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }

}

/**
 *  [GET] /reserve/past/list/:email
 */
exports.pastUse = async function (req, res) {
    if (!req.headers.token) return res.send(errResponse2(baseResponse.TOKEN_EMPTY))
    const decoded = jwt.verify(req.headers.token, secretKey);
    try {
        let userEmail = decoded.email;
        // const invalidation = await validator.oneParams(userEmail);
        // if (invalidation) return (res.send(errResponse(invalidation)));

        if(validator.isValidEmail(userEmail) == false)
            return res.send(errResponse(resStatus.SIGNIN_EMAIL_ERROR_TYPE));

        const pastUseResult = await reserveProvider.pastUse(userEmail);

        return(res.send(pastUseResult));
    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }

}

/**
 *  [GET] /reserve/unbookable/:farmid
 */
exports.unbookablePeriods = async function (req, res) {
    try {
        let farmID = req.params.farmid;
        // const invalidation = await validator.oneParams(farmID);
        // if (invalidation) return (res.send(errResponse(invalidation)));

        const unbookablePeriodsResult = await reserveProvider.unbookablePeriods(farmID);

        return(res.send(unbookablePeriodsResult));
    }
    catch (e) {
        return(res.send(errResponse(resStatus.SERVER_ERROR)));
    }

}