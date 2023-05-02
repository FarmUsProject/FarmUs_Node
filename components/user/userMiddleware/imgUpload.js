const multer = require("multer");
const multer_s3 = require('multer-s3');
const {S3_ACCESS} = require('../../../config/secret')

const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials:{
        accessKeyId: S3_ACCESS.KEY,
        secretAccessKey: S3_ACCESS.SECRET_KEY ,
    }

})

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

//exports.uploadImg = upload.single('file')
module.exports = upload.single('file');