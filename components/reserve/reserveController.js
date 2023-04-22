const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");
const reserveService = require("./reserveService");


/**
 * [POST] /reserve/request
 */
exports.request = async function (req, res) {
    // try {
        const { email, farmid, startDate, endDate } = req.body;
        const invalidation = await validator.newReservation(email, farmid, startDate, endDate);

        if (invalidation) return res.send(errResponse(invalidation));

        const reserveRequest_result = await reserveService.request(email, farmid, startDate, endDate);

        return res.send(reserveRequest_result)

    // }
    // catch (e) {
    //     return res.send(errResponse(resStatus.SERVER_ERROR));
    // }
}

/**
 * [GET] /reserve/farm/list/:farmid
*/
exports.clientsList = async function (req, res) {
    try {
    const farmid = req.params.farmid;
    const invalidation = await validator.oneParams(farmid);

    if (invalidation) return res.send(response(invalidation));

    const clientsListResponse = await reserveService.clientsList(farmid);

    return res.send(clientsListResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [GET] /reserve/client/list/:email
*/
exports.farmsList = async function (req, res) {
    try {

        const userEmail = req.params.email;
        const invalidation = await validator.oneParams(userEmail);

        if (invalidation) return res.send(response(invalidation));

        const farmsListResponse = await reserveService.farmsList(userEmail);

        return res.send(farmsListResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}
/**
 * [PUT] /reserve/cancel:reserveid
*/
exports.cancel = async function (req, res) {
    try {

        const reserveId = req.params.reserveid;
        const invalidation = await validator.oneParams(reserveId);

        if (invalidation) return response(invalidation);

        const cancelReservation = await reserveService.cancel(reserveId);

        return response(cancelReservation)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}