const baseResponse = require('../../config/resStatus');
const {response, errResponse} = require("../../config/response");
const axios = require('axios')
const {NCP_SENS} = require('../../config/secret')
const CryptoJS = require('crypto-js')
//onst {client} = require('../../config/redisMiddleware')
const redis = require('redis')
const {REDIS} = require('../../config/secret')
/**
 * [GET] /app/test
 */
let client = {}
const connectRedis = async() => {
    try{
        const redisClient = await redis.createClient({
            url: `redis://${REDIS.USERNAME}:${REDIS.PASSWORD}@${REDIS.HOST}:${REDIS.PORT}/0`,
            legacyMode: true,
        })

        redisClient.on('connect',()=>{
            console.log('Redis Connected');
        })
        redisClient.on('error',(err)=>{
            console.log('Redis Client Error',err)
        })
        redisClient.connect().then()
        client = redisClient.v4
    }catch(err){
        console.log(baseResponse.REDIS_ERROR);
        //return res.send(response(baseResponse.REDIS_ERROR))
    }
}
connectRedis()

exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}


exports.userAuthentication = async function (req, res) {
    try{
        const phoneNumber = req.body.phoneNumber
        if (phoneNumber){
            if (phoneNumber.length != 11)
                return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH))
        }
        else{
            return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY))
        }

        let code = ''
        for (let i = 0; i<6; i++)
            code += Math.floor(Math.random()*10)

        let authenticationData = await client.set(phoneNumber, code, {EX: 180})

        const date = Date.now()+''
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, NCP_SENS.SECRET_KEY)
        hmac.update("POST")
        hmac.update(" ")
        hmac.update(`/sms/v2/services/${NCP_SENS.SERVICEID}/messages`)
        hmac.update("\n")
        hmac.update(date)
        hmac.update('\n')
        hmac.update(NCP_SENS.ACCESS_KEY_ID)

        const hash = hmac.finalize()
        const signature = hash.toString(CryptoJS.enc.Base64)

        const sendMessage = await axios({
            method: 'POST',
            url: `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_SENS.SERVICEID}/messages`,
            headers: {
                "Contenc-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": NCP_SENS.ACCESS_KEY_ID,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
              },
            data: {
              type: "SMS",
              countryCode: "82",
              from: NCP_SENS.FROM,
              content: `<FarmUS> 인증번호는 ${code} 입니다.`,
              messages: [{ to: `${phoneNumber}` }],
            },
        })
        return res.send(response(baseResponse.SUCCESS))
    }
    catch(err){
        console.log(err);
        return res.send(response(baseResponse.SIGNUP_SMS_WRONG))
    }
}

exports.vertifyCode = async(req,res) => {
    const {phoneNumber, usercode} = req.body
    const code = await client.get(phoneNumber)
    if (code == usercode){
        await client.del(phoneNumber)
        return res.send(response(baseResponse.SUCCESS))
    }else{
        console.log(code);
        return res.send(response(baseResponse.SIGNUP_SMS_CODE_WRONG))
    }
}