const multer = require("multer");
const path = require('path')

const DIR = "config/images/";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, DIR);
},
    filename: (req, file, callback) => {
        //callback(null, file.originalname);
        const ext = path.extname(file.originalname)
        console.log(ext);
        callback(null, path.basename(file.originalname, ext)+"-"+ Date.now() + ext)
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        callback(null, true);
        } else {
        callback(null, false);
        return callback(new Error("Only .png .jpg and .jpeg format allowed!"));
        }
    },
});

module.exports = function(app){
    const user = require('./userController');

    // 1. 로그인 API
    app.post('/user/login', user.login)

    // 2. 회원가입 API
    app.post('/user/signup', user.signup)

    // verificatoin
    app.post('/user/signup/verification',user.userAuthentication)
    app.post('/user/verification',user.vertifyCode)

    // find
    app.get('/user/find-account',user.findAccount)
    app.get('/user/find-password',user.findPassword)

    //editInfo
    app.patch('/mypage/editInfo/nickname',user.editUserNickName)
    app.patch('/mypage/editInfo/name',user.editUserName)
    app.patch('/mypage/editInfo/password',user.editUserPassword)
    app.patch('/mypage/editInfo/phoneNumber',user.editUserPhoneNumber)
    app.patch('/mypage/editInfo/profileImg',upload.single("file"),user.editUserProfileImg)

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