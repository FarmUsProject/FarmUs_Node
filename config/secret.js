const dotenv = require('dotenv')
dotenv.config()

const googleSecret = process.env.GOOGLE_KEY
const NCP_SENS={
    ACCESS_KEY_ID : process.env.NCP_SENS_ACCESS_KEY_ID,
    SECRET_KEY : process.env.NCP_SENS_SECRET_KEY,
    SERVICEID : process.env.NCP_SENS_SERVICEID,
    FROM : process.env.NCP_SENS_FROM
}
const REDIS = {
    HOST : process.env.REDIS_HOST,
    PORT : process.env.REDIS_PORT,
    USERNAME : process.env.REDIS_USERNAME,
    PASSWORD : process.env.REDIS_PASSWORD,
}
const DB_ENV = {
    HOST : process.env.DB_HOST,
    USER : process.env.DB_USER,
    PORT : process.env.DB_PORT,
    PASSWORD : process.env.DB_PASSWORD,
    DATABASE : process.env.DB_DATABASE
}
const S3_ACCESS = {
    KEY : process.env.S3_KEY,
    SECRET_KEY : process.env.S3_SECRET_KEY
}
module.exports = {
    googleSecret,
    NCP_SENS,
    REDIS,
    DB_ENV,
    S3_ACCESS
}