const { response, errResponse } = require('./../../config/response');
const validator = require('../../helpers/validator');
const resStatus = require("../../config/resStatus");
const userService = require("../user/userService");
const oauthService = require('./oauthService');

/**
 * [POST] /oauth/kakao/signup
*/
exports.signup = async function (req, res) {
    try {
        const { email, phoneNumber, name, role } = req.body;
        const invalidation = await validator.signUp(email, phoneNumber, name, role);

        if (invalidation) return res.send(errResponse(invalidation));

        const signUpResponse = await oauthService.signUp(email, phoneNumber, name, role);

        return res.send(signUpResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}