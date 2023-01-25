const baseResponse = require("../../config/resStatus");
const {response, errResponse} = require("../../config/response");


/**
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * [PUT] /farm/postings/:postid
 */
exports.reserve = async function (req, res) {

}

/**
 * [POST] /farm/postings
 */
exports.post = async function (req, res) {

}