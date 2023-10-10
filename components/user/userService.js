const userProvider = require('./../user/userProvider');
const userDao = require('./../user/userDao');
const farmProvider = require('./../farm/farmProvider');
const farmService = require('./../farm/farmService');
const farmDao = require('./../farm/farmDao');
const { response, errResponse } = require('../../config/response');
const { response2, errResponse2 } = require('../../config/response2');
const resStatus = require('../../config/resStatus');
const baseResponse = require('../../config/resStatus')
const resStatus_5000 = require('../../config/resStatus_5000');
const encryptedPassword = require('../../helpers/encrypt');
const jwtLogin = require('./../../config/jwtLogin');
const { pool } = require('../../config/database');
const setDate = require('./../../helpers/setDate');
const withConnection = require('../../config/connection')

exports.login = async(email, password) =>{

    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    console.log(userInfo);

    const userPassword = userInfo.Password;
    const userSalt = userInfo.Salt;

    const verify = await encryptedPassword.verifyPassword(password, userSalt, userPassword);

    if (!verify) return errResponse(resStatus.SIGNIN_PASSWORD_WRONG);

    const jwtResponse = await jwtLogin(userInfo);

    return response(resStatus_5000.USER_LOGIN_SUCCESS, jwtResponse);
};


exports.signUp = withConnection(async (connection, email, password, phoneNumber, nickName, name, role) => {
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length >= 1) return errResponse(resStatus.SIGNUP_REDUNDANT_EMAIL);

    const user = await userProvider.retrieveUser(phoneNumber);
    if (user) return errResponse(baseResponse.ALREADY_USER);

    const encryptedData = await encryptedPassword.createHashedPassword(password);
    const hashedPassword = encryptedData.hashedPassword;
    const salt = encryptedData.salt;
    const now = await setDate.now();
    const newUserInfo = [email, hashedPassword, salt, phoneNumber, nickName, name, role, now, now];

    const newUser = await userDao.insertUser(connection, newUserInfo);

    return response(resStatus_5000.USER_SIGNUP_SUCCESS, { "email": email, "role": role });
});

exports.addLike = withConnection(async (connection, email, farmId) => {
    const userInfo = await userProvider.usersbyEmail(email);
    const farmInfo = await farmProvider.farmbyfarmID(farmId);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    if (!farmInfo) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    let newstarList;
    const userStarList = await userProvider.starListbyEmail(email);
    if (userStarList[0].LikeFarmIDs && userStarList[0].LikeFarmIDs.length > 0) {
        let startListString = userStarList[0].LikeFarmIDs;
        const existedArr = startListString.split(",");
        for (let e of existedArr) {
            e = e.trim();
            if (e.localeCompare(farmId) === 0) return errResponse(resStatus_5000.USER_REDUNDANT_STAR);
        }
        newstarList = userStarList[0].LikeFarmIDs + ", " + farmId;
    } else {
        newstarList = farmId;
    }
    console.log("newstarList", newstarList);

    const starRequest = [newstarList, email];

    const starList = await userDao.updateUserLikes(connection, starRequest);

    /**
     * PLUS # OF FARM Like
     */
    let updatedStarNumber = farmInfo.Likes + 1;
    try {
        const updatedStarNumberInfo = [updatedStarNumber, farmId];
        const updatedStar = await farmDao.updateFarmLikes(connection, updatedStarNumberInfo);
    } catch (e) {
        return errResponse(resStatus_5000.FARM_UPDATE_STAR_ERROR);
    }

    return response(baseResponse.SUCCESS);
});

exports.updateUserLikes = withConnection(async (connection, likeFarms, email) => {
    const [updateUser] = await userDao.updateUserLikes(connection, [likeFarms, email]);
    return updateUser;
});

exports.unLike = async(email, farmID) =>{
    try{
        const userInfo = await userProvider.usersbyEmail(email);
        const farmInfo = await farmProvider.farmbyfarmID(farmID);
        if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
        if (!farmInfo)  return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

        const likeFarmsArray = userInfo[0].LikeFarmIDs.split(', ');
        const indexToDelete = likeFarmsArray.indexOf(String(farmID));
        if (indexToDelete !== -1) {
            likeFarmsArray.splice(indexToDelete, 1);
        }
        const likeFarms = likeFarmsArray.join(', ');

        const updateFarm = await farmService.deleteLike(farmInfo.Likes-1,farmID)
        const updateUser = await exports.updateUserLikes(likeFarms, email)

        return response2(baseResponse.SUCCESS)
    }catch(e){
        console.log(e);
        return errResponse2(baseResponse.SERVER_ERROR)
    }
}

exports.editBirth = withConnection(async (connection, email, birth) => {
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const now = await setDate.now();
    const newUserInfo = [birth, now, email];

    const editBirthResult = await userDao.updateUserBirth(connection, newUserInfo);

    return response(resStatus_5000.USER_BIRTH_EDIT_SUCCESS, { "birth": birth });
});

exports.editPassword = withConnection(async (connection, email, password) => {
    console.log(email);
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const encryptedData = await encryptedPassword.createHashedPassword(password);
    const hashedPassword = encryptedData.hashedPassword;
    const salt = encryptedData.salt;
    const newUserInfo = [hashedPassword, salt, email];

    const editPasswordResult = await userDao.updatePassword(connection, newUserInfo);
    if (editPasswordResult.affectedRows) return true;
    else return false;
});

exports.editNickName = withConnection(async (connection, email, nickname) => {
    const res = await userDao.updateNickName(connection, email, nickname);
    if (res.affectedRows) return true;
    else return false;
});

exports.editName = withConnection(async (connection, email, name) => {
    const res = await userDao.updateName(connection, email, name);
    if (res.affectedRows) return true;
    else return false;
});

exports.editPhoneNumber = withConnection(async (connection, email, phoneNumber) => {
    const res = await userDao.updatePhoneNum(connection, email, phoneNumber);
    if (res.affectedRows) return true;
    else return false;
});

exports.deleteUser = withConnection(async (connection, email) => {
    const res = await userDao.withdrawalUser(connection, email);
    if (res.affectedRows) return true;
    else return false;
});

exports.eidtProfileImg = withConnection(async (connection, email, img, key) => {
    const res = await userDao.eidtProfileImg(connection, email, img, key);
    if (res.affectedRows) return true;
    else return false;
});
