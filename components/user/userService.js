const userProvider = require('./../user/userProvider');
const userDao = require('./../user/userDao');
const farmProvider = require('./../farm/farmProvider');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const resStatus_5000 = require('../../config/resStatus_5000');
const encryptedPassword = require('../../helpers/encrypt');
const jwtLogin = require('./../../config/jwtLogin');
const { pool } = require('../../config/database');
const setDate = require('./../../helpers/setDate');

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
    const now = await setDate.now();
    const newUserInfo = [email, hashedPassword, salt, phoneNumber, nickName, name, role, now, now];

    const connection = await pool.getConnection(async conn => conn);
    const newUser = await userDao.insertUser(connection, newUserInfo);

    connection.release();

    return response(resStatus_5000.USER_SIGNUP_SUCCESS, {"email" : email, "role" : role});
};

async function addStar(email, farmId) {
    const userInfo = await userProvider.userbyEmail(email);
    const farmInfo = await farmProvider.farmbyfarmID(farmId);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    if (farmInfo.length < 1) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    let newstarList;
    const userStarList = await userProvider.starListbyEmail(email);
    if (userStarList.length > 0) newstarList = userStarList + ", " + toString(farmId);
    else newstarList = toString(farmId);

    const starRequest = [email, newstarList];
    
    const connection = await pool.getConnection(async conn => conn);
    const starList = await userDao.updateUserStar(connection, starRequest);

    connection.release();

    return response(resStatus_5000.USER_STAR_ADD_SUCCESS, null);
}

async function editBirth(email, birth) {
    const userInfo = await userProvider.userbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const now = await setDate.now();
    const newUserInfo = [email, birth, now];

    const connection = await pool.getConnection(async conn => conn);

    const editBirthResult = await userDao.updateUserBirth(connection, newUserInfo);

    connection.release();

    return response(resStatus_5000.USER_BIRTH_EDIT_SUCCESS, {"birth" : birth})
}

module.exports = {
    login,
    signUp,
    addStar,
    editBirth
};