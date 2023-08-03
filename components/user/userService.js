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

exports.login = async(email, password) =>{

    const userInfo = await userProvider.retrieveUserEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    console.log(userInfo);

    const userPassword = userInfo.Password;
    const userSalt = userInfo.Salt;

    const verify = await encryptedPassword.verifyPassword(password, userSalt, userPassword);

    if (!verify) return errResponse(resStatus.SIGNIN_PASSWORD_WRONG);

    const jwtResponse = await jwtLogin(userInfo);

    return response(resStatus_5000.USER_LOGIN_SUCCESS, jwtResponse);
};


exports.signUp = async(email, password, phoneNumber, nickName, name, role) =>{
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length >= 1) return errResponse(resStatus.SIGNUP_REDUNDANT_EMAIL);

    const user = await userProvider.retrieveUser(phoneNumber);
    if (user) return errResponse(baseResponse.ALREADY_USER)

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

exports.addLike= async(email, farmId) =>{
    const userInfo = await userProvider.usersbyEmail(email);
    const farmInfo = await farmProvider.farmbyfarmID(farmId);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);
    if (!farmInfo)  return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    let newstarList;
    const userStarList = await userProvider.starListbyEmail(email);
    if (userStarList[0].LikeFarmIDs && userStarList[0].LikeFarmIDs.length > 0) {
        let startListString = userStarList[0].LikeFarmIDs;
        const existedArr = startListString.split(",");
        existedArr
        for (let e of existedArr) {
            e = e.trim();
            if(e.localeCompare(farmId) === 0 ) return errResponse(resStatus_5000.USER_REDUNDANT_STAR);
        }
        newstarList = userStarList[0].LikeFarmIDs + ", " + farmId;
    }
    else newstarList = farmId;
    console.log("newstarList", newstarList);

    const starRequest = [newstarList, email];

    const connection = await pool.getConnection(async conn => conn);
    const starList = await userDao.updateUserLikes(connection, starRequest);

    /**
     * PLUS # OF FARM Like
    */
    let updatedStarNumber = farmInfo.Likes + 1;
    try {

/*
        if (farmInfo.Likes && farmInfo.Likes > 0) {
            //updatedStarNumber += farmInfo.Likes;

        }
        else updatedStarNumber = 1;
        */
        // console.log("updatedStarNumber", updatedStarNumber);

        const updatedStarNumberInfo = [updatedStarNumber, farmId]
        const updatedStar = await farmDao.updateFarmLikes(connection, updatedStarNumberInfo);

        connection.release();

    }
    catch (e) {
        return errResponse(resStatus_5000.FARM_UPDATE_STAR_ERROR);
    }

    return response(baseResponse.SUCCESS);
}
exports.updateUserLikes = async(likeFarms, email) => {
    const connection = await pool.getConnection(async conn => conn);
    const [updateUser] = await userDao.updateUserLikes(connection, [likeFarms, email]);
    connection.release();

    return updateUser
}

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

exports.editBirth = async(email, birth) =>{
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const now = await setDate.now();
    const newUserInfo = [birth, now, email];

    const connection = await pool.getConnection(async conn => conn);

    const editBirthResult = await userDao.updateUserBirth(connection, newUserInfo);

    connection.release();

    return response(resStatus_5000.USER_BIRTH_EDIT_SUCCESS, {"birth" : birth})
}


exports.editPassword = async (email,password) =>{
    const userInfo = await userProvider.usersbyEmail(email);
    if (userInfo.length < 1) return errResponse(resStatus.USER_USEREMAIL_NOT_EXIST);

    const encryptedData = await encryptedPassword.createHashedPassword(password);
    const hashedPassword = encryptedData.hashedPassword;
    const salt = encryptedData.salt;
    const newUserInfo = [hashedPassword, salt, email];

    const connection = await pool.getConnection(async conn => conn);

    const editPasswordResult = await userDao.updatePassword(connection, newUserInfo);

    connection.release();

    return response(resStatus_5000.USER_PASSWORD_EDIT_SUCCESS)
}

exports.editNickName = async (email,nickname) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updateNickName(connection, email, nickname)
        connection.release()
        if (res)
            return response2(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

exports.editName = async (email,name) =>{
    try{
        console.log(name);
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updateName(connection, email, name)
        console.log(res);
        connection.release()
        if (res)
            return response2(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

exports.editPhoneNumber = async (email,phoneNumber) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updatePhoneNum(connection, email, phoneNumber)
        connection.release()
        if (res)
            return response2(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

exports.deleteUser = async (email) => {
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.withdrawalUser(connection, email)

        connection.release()

        if (res) return response2(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

exports.eidtProfileImg = async(email, img, key) => {
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.eidtProfileImg(connection, email, img, key)

        connection.release()

        if (res) return response2(baseResponse.SUCCESS)
    }catch(err){
        console.log(err);
        return errResponse2(baseResponse.DB_ERROR)
    }
}

