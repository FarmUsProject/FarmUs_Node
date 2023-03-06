const userProvider = require('./../user/userProvider');
const userDao = require('./../user/userDao');
const userProvider = require('./../user/userProvider');
const oauthDao = require('./oauthDao');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const { pool } = require('../../config/database');
const setDate = require('./../../helpers/setDate');

async function signUp(email, phoneNumber, name, role) {
    const userInfobyEmail = await userProvider.userbyEmail(email);
    if (userInfobyEmail.length >= 1) return errResponse(resStatus_5000.USER_OAUTH_SIGNUP_REDUNDANT_EMAIL);

    // const userInfobyPhoneNumber = await userProvider.userbyPhoneNumber(phoneNumber);
    // if(userInfobyPhoneNumber.length >=1) return errResponse(resStatus_5000.USER_OAUTH_SIGNUP_REDUNDANT_PHONE);

    const now = await setDate.now();
    const newOauthUserInfo = [email, phoneNumber, name, role, now, now];

    const connection = await pool.getConnection(async conn => conn);
    const newOauthUser = await oauthDao.insertOauthUser(connection, newOauthUserInfo);

    connection.release();

    return response(resStatus_5000.USER_OAUTH_SIGNUP_SUCCESS, {"email" : email, "role" : role});
};

module.exports = {
    signUp,
};