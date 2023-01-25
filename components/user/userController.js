const baseResponse = require("../../config/resStatus");
const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");


/**
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * [POST] /user/login
 */
exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        const invalidation = await validator.login(email, password);

        if (invalidation) return errResponse(loginResponse)

        const loginResponse = await userService.login(email, password)

        return res.send(loginResponse)

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [POST] /user/signup
*/
exports.signup = async function () {

}