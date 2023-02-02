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



    app.post('/user/signup/verification',user.userAuthentication)
    app.post('/user/verification',user.vertifyCode)

    app.get('/user/find-account',user.findAccount)
    app.get('/user/find-password',user.findPassword)

    app.patch('/mypage/editInfo/nickname',user.editUserNickName)
    app.patch('/mypage/editInfo/name',user.editUserName)
    app.patch('/mypage/editInfo/password',user.editUsePassword)
    app.patch('/mypage/editInfo/phoneNumber',user.editUserPhoneNumber)
    app.patch('/mypage/editInfo/profileImg',upload.single("file"),user.editUserProfileImg)
    app.patch('/user/withdrawal',user.withdrawal)

};