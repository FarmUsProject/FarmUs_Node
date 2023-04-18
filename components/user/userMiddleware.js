const s3 = require('../../config/s3')
const multer = require("multer");
const multer_s3 = require('multer-s3');


const imgUpload = (req,res,next) =>{
    const storage = multer_s3({
        s3:s3,
        bucket:'farmus',
        contentType: multer_s3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, `user/${Date.now()}_${file.originalname}`);
        }
    })

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

    upload.single("file")
    console.log("완료");
    next()
}

module.exports = imgUpload