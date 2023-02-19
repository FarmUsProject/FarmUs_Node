const { response, errResponse } = require('./../../config/response');
const resStatus = require("../../config/resStatus");
const userService = require("./userService");
const validator = require('../../helpers/validator');
const dateAvailability = require('../../helpers/DateAvailability');

/**
 * [POST] /user/login
 */
exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        const invalidation = await validator.login(email, password);

        if (invalidation) return res.send(errResponse(invalidation));

        const loginResponse = await userService.login(email, password);

        return res.send(loginResponse);

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

        if (invalidation) return res.send(errResponse(invalidation));

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

/**
 *  [POST] /user/birth
 */
exports.birth = async function (req, res) {
    try {
        const { email, birth } = req.body;
        const invalidation = await validator.oneParams(birth);

        if (invalidation) return errResponse(invalidation);

        if(!dateAvailability.isValidDatetype)
        return errResponse(resStatus_5000.DATE_TYPE_WEIRD);

        const birthResponse = await userService.editBirth(email, birth);

        return res.send(birthResponse);
    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR))
    }
}