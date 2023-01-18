const baseResponse = require("../../config/resStatus");
const {response, errResponse} = require("../../config/response");


/**
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}