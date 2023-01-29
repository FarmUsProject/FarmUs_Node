const userProvider = require('./userProvider');
const userDao = require('./userDao');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const encryptedPassword = require('../../helpers/encrypt');
const jwtLogin = require('./../../config/jwtLogin');
const { pool } = require('../../config/database');

async function login(email, password) {

    const userInfo = await userProvider.userbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const userPassword = userInfo[0].Password;
    const userSalt = userInfo[0].Salt;

    const verify = await encryptedPassword.verifyPassword(password, userSalt, userPassword);

    if (!verify) return errResponse(resStatus.SIGNIN_PASSWORD_WRONG);

    const jwtResponse = await jwtLogin(userInfo[0]);

    return response(resStatus_5000.USER_LOGIN_SUCCESS, jwtResponse);
};


async function signUp(email, password, phoneNumber, nickName, name, role) {
    const userInfo = await userProvider.userbyEmail(email);
    if (userInfo.length >= 1) return errResponse(resStatus.SIGNUP_REDUNDANT_EMAIL);

    const encryptedData = await encryptedPassword.createHashedPassword(password);
    const hashedPassword = encryptedData.hashedPassword;
    const salt = encryptedData.salt;
    const newUserInfo = [email, hashedPassword, salt, phoneNumber, nickName, name, role];

    const connection = await pool.getConnection(async conn => conn);
    const newUser = await userDao.insertUser(connection, newUserInfo);

    connection.release();

    return response(resStatus_5000.USER_SIGNUP_SUCCESS, {"email" : email, "role" : role});
};

module.exports = {
    login,
    signUp
};