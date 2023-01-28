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