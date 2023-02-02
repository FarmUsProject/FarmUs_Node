module.exports = function(app){
    const user = require('./userController');

    app.post('/user/signup/verification',user.userAuthentication)
    app.post('/user/verification',user.vertifyCode)

    app.get('/user/find-account',user.findAccount)
    app.get('/user/find-password',user.findPassword)

    app.patch('/mypage/editInfo/nickname',user.editUserNickName)
    app.patch('/mypage/editInfo/name',user.editUserName)
    app.patch('/mypage/editInfo/password',user.editUsePassword)
    app.patch('/mypage/editInfo/phoneNumber',user.editUserPhoneNumber)
    app.patch('/mypage/editInfo/profileImg',user.editUserProfileImg)
    app.patch('/user/withdrawal',user.withdrawal)

};