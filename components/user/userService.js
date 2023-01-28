const userProvider = require('./../user/userProvider');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const encryptedPassword = require('../../helpers/encrypt');
const jwtLogin = require('./../../config/jwtLogin');
const { pool } = require('../../config/database');

async function login(email, password) {

    const userInfo = await userProvider.userbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const userPassword = userInfo[0].password;
    const userSalt = userInfo[0].salt;
    const verify = await encryptedPassword.verifyPassword(password, userSalt, userPassword);

    if (!verify) return response(errResponse(resStatus.SIGNIN_PASSWORD_WRONG));

    const jwtResponse = await jwtLogin(userInfo[0]);

    return response(true, 200, "로그인이 완료되었습니다", jwtResponse);
};


async function signUp(email, password, phoneNumber, nickName, name, role) {
    const userInfo = await userProvider.userbyEmail(newUserInfo.email);
    if (userInfo.length >= 1) return errResponse(resStatus.SIGNUP_REDUNDANT_EMAIL);

    const encryptedData = await encryptedPassword.createHashedPassword(password);
    const hashedPassword = encryptedData.hashedPassword;
    const salt = encryptedData.salt;
    const newUserInfo = [email, hashedPassword, salt, phoneNumber, nickName, name, role];

    const connection = await pool.getConnection(async conn => conn);
    const newUser = await userDao.insertUser(connection, newUserInfo);

    connection.release();

    return response(true, 200, "회원가입이 완료되었습니다", null);
};

module.exports = {
    login,
    signUp
};