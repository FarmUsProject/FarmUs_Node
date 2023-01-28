const baseResponse = require("../../config/resStatus");
const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");
const reserveService = require("./reserveService");


/**
 * [POST] /reserve/request
 */
exports.request = async function (req, res) {
    try {
        const { email, farmid } = req.body;
        const invalidation = await validator.newReservation(email, farmid);

        if (invalidation) return errResponse(invalidation);

        const reserveRequest_result = await reserveService.request(email, farmid);

        return res.send(reserveRequest_result)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [PUT] /reserve/farm/list/:farmid
*/
exports.clientsList = async function (req, res) {
    try {
        const farmid = req.params.farmid;
        const invalidation = await validator.oneParams(farmid);

        if (invalidation) return response(invalidation);

        const clientsListResponse = await reserveService.clientsList(farmid);

        return response(clientsListResponse)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [PUT] /reserve/client/list/:email
*/
exports.farmsList = async function (req, res) {
    try {

        const userEmail = req.params.email;
        const invalidation = await validator.oneParams(userEmail);

        if (invalidation) return response(invalidation);

        const farmsListResponse = await reserveService.farmsList(userEmail);

        return response(farmsListResponse)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}