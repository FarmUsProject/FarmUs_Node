const multer = require("multer");
const multer_s3 = require('multer-s3');
const {S3_ACCESS} = require('../config/secret')

const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials:{
        accessKeyId: S3_ACCESS.KEY,
        secretAccessKey: S3_ACCESS.SECRET_KEY ,
    }

})

exports.module = s3;