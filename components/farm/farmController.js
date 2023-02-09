const farmService = require('./farmService');
const resStatus = require('./../../config/resStatus');
const {response, errResponse} = require("../../config/response");
const validator = require('./../../helpers/validator');

/**
 * [POST] /farm/postings
 */
exports.newFarm = async function (req, res) {
    // try {
        const { name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag } = req.body;
        const invalidation = await validator.newFarm(name, owner, startDate, endDate, price, squaredMeters, location);

        if (invalidation) return res.send(errResponse(invalidation))

        const newFarmResponse = await farmService.newFarm(name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag);

        return res.send(newFarmResponse)

    // }
    // catch (e) {
    //     res.send(errResponse(resStatus.SERVER_ERROR));
    // }
}