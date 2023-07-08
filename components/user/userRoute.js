const uploadImg = require('./userMiddleware/imgUpload')
const deleteImg = require('./userMiddleware/imgDelete')
module.exports = function(app){
    const user = require('./userController');

    // 1. 로그인 API
    app.post('/user/login', user.login)

    // 2. 회원가입 API
    app.post('/user/signup', user.signup)

    // verificatoin
    app.post('/user/signup/verification',user.userAuthentication)
    app.post('/user/verification',user.vertifyCode)
    app.get('/user/email/verification/:email', user.verfiyEmail)

    // find
    app.get('/user/find-account',user.findAccount)
    app.get('/user/find-password',user.findPassword)

    //editInfo
    app.patch('/mypage/editInfo/nickname',user.editUserNickName)
    app.patch('/mypage/editInfo/name',user.editUserName)
    app.patch('/mypage/editInfo/password',user.editUserPassword)
    app.patch('/mypage/editInfo/phoneNumber',user.editUserPhoneNumber)
    app.patch('/mypage/editInfo/profileImg',uploadImg,deleteImg,user.editUserProfileImg)

    //회원 탈퇴
    app.delete('/user/withdrawal',user.withdrawal)

    //user CurUse_farm 가져오기
    app.get("farm/get_befoArray:userid", user.getBefoFarmUsed_Array);

    app.get("farm/get_curArray:userid", user.getCurFarmUse_Array);

    // 8. 농장 찜하기 API
    app.post('/user/star', user.star)

    //9. 생일 등록 API
    app.post('/user/birth', user.birth)


};