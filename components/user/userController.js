const baseResponse = require("../../config/resStatus");
const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");
const userService = require("./userService")


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

        if (invalidation) return errResponse(invalidation)

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
exports.signup = async function (req, res) {
    try {
        const { email, password, phoneNumber, nickName, name, role } = req.body;
        const invalidation = await validator.signUp(email, password, phoneNumber, nickName, name, role);

        if (invalidation) return errResponse(invalidation);

        const signUpResponse = await userService.signUp(email, password, phoneNumber, nickName, name, role);

        return res.send(signUpResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 *  [POST] /user/star
 */
exports.star = async function (req, res) {
    try {
        const { email, farmid } = req.body;
        const invalidation = await validator.twoParams(email, farmid);

        if (invalidation) return errResponse(invalidation);

        const starResponse = await userService.addStar(email, farmid);

        return res.send(starResponse);
    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}