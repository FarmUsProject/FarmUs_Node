const {S3_ACCESS} = require('./secret')
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials:{
        accessKeyId: S3_ACCESS.KEY,
        secretAccessKey: S3_ACCESS.SECRET_KEY ,
    }
})

module.exports = s3;