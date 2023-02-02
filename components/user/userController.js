const baseResponse = require('../../config/resStatus');
const {response, errResponse} = require("../../config/response");
const axios = require('axios')
const {NCP_SENS, googleSecret, REDIS} = require('../../config/secret')
const CryptoJS = require('crypto-js')
const redis = require('redis')
const userProvider = require('./userProvider')
const userService = require('./userService')
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require('path')


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

const sendSMS = async (phoneNum) =>{
    let code = ''
    for (let i = 0; i<6; i++)
        code += Math.floor(Math.random()*10)

    let authenticationData = await client.set(phoneNum, code, {EX: 180})

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
          messages: [{ to: `${phoneNum}` }],
        },
    })
}

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

        sendSMS(phoneNumber)

        return res.send(response(baseResponse.SUCCESS))
    }
    catch(err){
        console.log(err);
        return res.send(response(baseResponse.SIGNUP_SMS_WRONG))
    }
}

exports.vertifyCode = async(req,res) => {
    const {phoneNumber, usercode,name} = req.body
    const code = await client.get(phoneNumber)
    if (code == usercode){
        console.log(code);
        console.log(client);
        await client.del(phoneNumber)

        if (name){
            const email = await client.get(name)
            await client.del(name)
            return res.send({"name": name, "email": email})
        }
        return res.send(response(baseResponse.SUCCESS))
    }else{
        console.log(code);
        return res.send(response(baseResponse.SIGNUP_SMS_CODE_WRONG))
    }
}

exports.findAccount = async(req,res) => {
    try{
        const {name, phoneNumber} = req.query

        if (!name) return res.send(errResponse(baseResponse.USER_NAME_EMPTY))
        if (!phoneNumber) return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY))

        const user = await userProvider.retrieveUser(name, phoneNumber)
        if (!user) return res.send(errResponse(baseResponse.USER_NOT_EXIST))

        let userData = await client.set(name, user.Email, {EX: 185})
        sendSMS(phoneNumber)
        return res.send(response(baseResponse.SUCCESS))

    }catch(err){
        console.log(err);
        return res.send(response(baseResponse.SIGNUP_SMS_WRONG))
    }

}

exports.findPassword = async(req,res) => {
    try {
        let tempPw = Math.random().toString(36).substring(2, 12);
        const  {userEmail}  = req.query;
        //console.log(userEmail);

        if (!userEmail)
            return res.send(errResponse(baseResponse.USER_USEREMAIL_EMPTY))

        const user = await userProvider.retrieveUserEmail(userEmail)
        if (!user) return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST))

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "9659tig@gmail.com",
          pass: googleSecret,
        },
      });


      const setTempPw = await userService.editPassword(userEmail,tempPw)

      const mailOptions = {
        from: "9659tig@gmail.com",
        to: userEmail,
        subject: "<FarmUS> 임시 비밀번호",
        text: `<FarmUs>\n임시 비밀번호는 ${tempPw} 입니다.\n 로그인 후 비밀번호를 수정해주세요.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          transporter.close();
        }
      });

      return res.send(response(baseResponse.SUCCESS))
    } catch (err) {
      console.log(err);
      return res.send(errResponse(baseResponse.DB_ERROR))
    }

}

exports.editUserNickName = async(req,res) =>{
    const {userEmail}  = req.query;
    const {nickname} = req.body

    if (!nickname) return res.send(response(baseResponse.USER_NICKNAME_EMPTY))
    const eidtUser = await userService.editNickName(userEmail, nickname)

    return res.send(eidtUser)
}

exports.editUserName = async(req,res) =>{
    const {userEmail}  = req.query;
    const {name} = req.body

    if (!name) return res.send(response(baseResponse.USER_NAME_EMPTY))
    const eidtUser = await userService.editName(userEmail, name)

    return res.send(eidtUser)
}

exports.editUserPhoneNumber = async(req,res) =>{
    const {userEmail}  = req.query;
    const {phoneNumber} = req.body

    if (!phoneNumber) return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY))
    if (phoneNumber.length != 11) return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH))
    const eidtUser = await userService.editPhoneNumber(userEmail, phoneNumber)

    return res.send(eidtUser)
}

exports.editUsePassword = async(req,res) =>{
    const {userEmail}  = req.query;
    const {password} = req.body

    if (!password) return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY))
    const eidtUser = await userService.editPassword(userEmail, password)

    return res.send(eidtUser)
}

const DIR = "../../config/images/";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, DIR);
  },
  filename: (req, file, callback) => {
    //callback(null, file.originalname);
    const ext = path.extname(file.originalname)
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

exports.editUserProfileImg = async(req,res)=> {
    const {userEmail}  = req.query;
    const image = `/images/${req.file.filename}`

    const eidtImage = await userService.eidtProfileImg(userEmail, image)

    return res.send(eidtImage)
}

exports.withdrawal = async(req,res) => {
    const {userEmail}  = req.query;

    const userWithdraw = await userService.eidtUserStatus(userEmail)

    return res.send(userWithdraw)
}