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
        const { account_email, phone_number, profile_nickname, profile_image, role } = req.body;

        const invalidation = await validator.oauthSignup(account_email, phone_number, profile_nickname, role);

        if (invalidation) return res.send(errResponse(invalidation));

        const signUpResponse = await oauthService.signUp(account_email, phone_number, profile_nickname, profile_image, role);

        return res.send(signUpResponse);

    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}