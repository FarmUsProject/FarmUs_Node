const userDao = require('./userDao');
const withConnection = require('../../config/connection')

exports.retrieveUserEmail = withConnection(async (connection, userEmail) =>{
    const [res] = await userDao.selectUserbyEmail(connection, userEmail);
    return res[0];
});

exports.retrieveUser = withConnection(async (connection, phoneNumber) =>{
    const res = await userDao.selectUser(connection, phoneNumber);
    return res[0];
});

exports.usersbyEmail= withConnection(async (connection, email)=>{
    console.log(email);
    const [userInfo] = await userDao.selectUserbyEmail(connection, email);
    return userInfo;
});

exports.userbyPhoneNumber = withConnection(async (connection, phoneNumber)=>{
    const [userInfo] = await userDao.selectUserbyPhoneNumber(connection, phoneNumber);
    return userInfo;
});

exports.starListbyEmail = withConnection(async (connection, email)=>{
    const [starByEmail] = await userDao.selectStarbyEmail(connection, email);
    return starByEmail;
});

exports.nonSocialUsersbyEmail= withConnection(async (connection, email)=>{
    const [userInfo] = await userDao.selectnonSocialUserbyEmail(connection, email);
    return userInfo;
});
