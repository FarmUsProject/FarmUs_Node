const userProvider = require('./../user/userProvider');
const userDao = require('./../user/userDao');
const oauthDao = require('./oauthDao');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const { pool } = require('../../config/database');
const setDate = require('./../../helpers/setDate');

async function signUp(email, phoneNumber, name, picture_url, role) {
    //account_email, phone_number, profile_nickname, profile_image, role
    try{
        const userInfobyEmail = await userProvider.usersbyEmail(email);
        if (userInfobyEmail.length >= 1) return response(resStatus_5000.USER_OAUTH_SIGNUP_REDUNDANT_EMAIL, null);

        // const userInfobyPhoneNumber = await userProvider.userbyPhoneNumber(phoneNumber);
        // if(userInfobyPhoneNumber.length >=1) return errResponse(resStatus_5000.USER_OAUTH_SIGNUP_REDUNDANT_PHONE);

        socialLoginStatus = 'S';
        const now = await setDate.now();
        const newOauthUserInfo = [email, phoneNumber, name, picture_url, role, socialLoginStatus, now, now];

        const connection = await pool.getConnection(async conn => conn);
        const newOauthUser = await oauthDao.insertOauthUser(connection, newOauthUserInfo);

        connection.release();

        return response(resStatus_5000.USER_OAUTH_SIGNUP_SUCCESS, {
            "email": email,
            "phoneNumber": phoneNumber,
            "name": name,
            "picture_url": picture_url,
            "role": role
        });
} catch(e) {
    return Response(resStatus.DB_ERROR);
}
};

module.exports = {
    signUp,
};