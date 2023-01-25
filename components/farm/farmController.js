const farmService = require('./farmService');
const {response, errResponse} = require("../../config/response");
const validator = require('./../../helpers/validator');


/**
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * [POST] /farm/postings
 */
exports.newFarm = async function (req, res) {
    try {
        const { name, owner, picture_url, price, squaredMeters, location, description} = req.body;
        const invalidation = await validator.newFarm(name, owner, picture_url, price, squaredMeters, location, description);

        if (invalidation) return errResponse(invalidation)

        const newFarmResponse = await farmService.newFarm(name, owner, picture_url, price, squaredMeters, location, description)

        return res.send(newFarmResponse)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [PUT] /farm/postings/:postid
 */
exports.bookedFarm = async function (req, res) {
    try {
        const postid = req.params.postid;

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }

}