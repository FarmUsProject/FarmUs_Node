const { pool } = require('../../../config/database');
const userDao = require('../userDao')
const {errResponse2} = require('../../../config/response2')
const baseResponse = require('../../../config/resStatus')
const {S3_ACCESS} = require('../../../config/secret')

const { S3Client, DeleteObjectCommand  } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials:{
        accessKeyId: S3_ACCESS.KEY,
        secretAccessKey: S3_ACCESS.SECRET_KEY ,
    }

})
module.exports = deleteImg = async(req,res,next) => {
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const [res] = await userDao.selectUserbyEmail(connection,req.query.email)
        connection.release()

        if (res[0].Picture_key){
            const params = {
                Bucket:'farmus',
                Key: res[0].Picture_key
            }

            const deleteObjectCommand = new DeleteObjectCommand(params);

            s3.send(deleteObjectCommand)
            .then(() => console.log('Object deleted successfully'))
            .catch((err) => console.log('Error deleting object:', err));
        }
        else{
            console.log("프로필 신규 업로드");
        }
        next()

    }catch(err){
        console.log(err);
        console.log( errResponse2(baseResponse.DB_ERROR));
        return
    }

}