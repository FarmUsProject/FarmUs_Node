const userProvider = require('./../user/userProvider');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const encryptedPassword = require('../../helpers/encrypt');
const jwtLogin = require('./../../config/jwtLogin');

async function login(email, password) {

    const userInfo = await userProvider.userbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const userPassword = userInfo[0].password;
    const userSalt = userInfo[0].salt;
    const verify = await encryptedPassword.verifyPassword(password, userSalt, userPassword);

    if (!verify) return response(errResponse(resStatus.SIGNIN_PASSWORD_WRONG));

    const jwtResponse = await jwtLogin(userInfo[0])

    return response(true, 200, "로그인이 완료되었습니다", jwtResponse);
};

module.exports = {
    login,
};