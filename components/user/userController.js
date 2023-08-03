const axios = require('axios')
const CryptoJS = require('crypto-js')
const redis = require('redis')
const nodemailer = require("nodemailer");
const userService = require("./userService");
const farmService = require("../farm/farmService");
const userProvider = require("./userProvider");
const { response, errResponse } = require('./../../config/response');
const { response2, errResponse2 } = require('../../config/response2');
const resStatus = require("../../config/resStatus");
const baseResponse = require('../../config/resStatus');
const { FARMID_EMPTY } = require("../../config/resStatus");
const {NCP_SENS, googleSecret, REDIS} = require('../../config/secret')
const validator = require('../../helpers/validator');
const dateAvailability = require('../../helpers/DateAvailability');
const sharp = require('sharp');
const fs = require('fs');
const resStatus_5000 = require('../../config/resStatus_5000');
const jwtLogin = require('./../../config/jwtLogin');



exports.getBefoFarmUsed_Array = async (req, res, error) => {
    const { userid } = req.params;

    if (!userid) return res.render(errResponse(FARMID_EMPTY));

    const getUsedFarmArray = userProvider.retrieveUsedFarmArray(userid);
    res.render(getUsedFarmArray);
}

exports.getCurFarmUse_Array = async (req, res, error) => {
    const { userid } = req.params;

    if (!userid) return res.render(errResponse(FARMID_EMPTY));

    const getCurFarmArray = userProvider.retrieveCurFarmArray(userid);
    res.render(getCurFarmArray);

}

/**
 * [POST] /user/login
 */
exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        const invalidation = await validator.login(email, password);

        if (invalidation) return res.send(errResponse(invalidation));

        const loginResponse = await userService.login(email, password);

        return res.send(loginResponse);

    }
    catch (e) {
        console.log(e)
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 * [POST] /user/signup
*/
exports.signup = async function (req, res) {
    try {
        const { email, password, phoneNumber, nickName, name, role } = req.body;
        const invalidation = await validator.signUp(email, password, phoneNumber, nickName, name, role);

        if (invalidation) return res.send(errResponse(invalidation));

        const signUpResponse = await userService.signUp(email, password, phoneNumber, nickName, name, role);

        return res.send(signUpResponse);

    }
    catch (e) {
        console.log(e);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

/**
 *  [POST] /user/star
 */
exports.likes = async function (req, res) {
    // try {
        const { email, farmid } = req.body;
        const invalidation = await validator.twoParams(email, farmid);

        if (invalidation) return(res.send(errResponse(invalidation)));

        const starResponse = await userService.addLike(email, farmid);

        return(res.send(starResponse));
    // }
    // catch (e) {
    //     res.send(errResponse(resStatus.SERVER_ERROR));
    // }
}

exports.unliked = async(req,res)=>{
    const { email, farmid } = req.query;
    const invalidation = await validator.twoParams(email, farmid);
    if (invalidation) return(res.send(errResponse(invalidation)));

    const result = await userService.unLike(email, farmid)
    return res.send(result)
}

/**
 *  [POST] /user/birth
 */
exports.birth = async function (req, res) {
    try {
        const { email, birth } = req.body;
        const invalidation = await validator.oneParams(birth);

        if (invalidation) return(res.send(errResponse(invalidation)));

        if (!dateAvailability.isValidDatetype)
            return(res.send(errResponse(resStatus_5000.DATE_TYPE_WEIRD)));

        const birthResponse = await userService.editBirth(email, birth);

        return(res.send(birthResponse));
    }
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR))
    }
}

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

exports.userAuthentication = async function (req, res) {
    try{
        const phoneNumber = req.body.phoneNumber
        if (phoneNumber){
            if (phoneNumber.length != 11)
                return res.send(response2(baseResponse.SIGNUP_PHONENUMBER_LENGTH))
        }
        else{
            return res.send(response2(baseResponse.SIGNUP_PHONENUMBER_EMPTY))
        }

        sendSMS(phoneNumber)

        return res.send(response2(baseResponse.SUCCESS))
    }
    catch(err){
        console.log(err);
        return res.send(response2(baseResponse.SIGNUP_SMS_WRONG))
    }
}

exports.vertifyCode = async(req,res) => {
    const {phoneNumber, usercode} = req.body

    if (!phoneNumber)
        return res.send(errResponse2(baseResponse.SIGNUP_PHONENUMBER_EMPTY))


    const user = await userProvider.retrieveUser(phoneNumber)
    if (user) {
        if (user.Status == 'D') return res.send(errResponse2(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT))
        else if (user.Status == 'B') return res.send(errResponse2(baseResponse.SIGNIN_INACTIVE_ACCOUNT))

        return res.send(errResponse2(baseResponse.ALREADY_USER))
    }

    const code = await client.get(phoneNumber)
    if (code == usercode){
        //console.log(client);
        await client.del(phoneNumber)

        return res.send(baseResponse.SUCCESS)

    }else{
        console.log(code);
        return res.send(response2(baseResponse.SIGNUP_SMS_CODE_WRONG))
    }
}

exports.findAccount = async(req,res) => {
    try{
        const {name, phoneNumber} = req.query

        if (!name) return res.send(errResponse2(baseResponse.USER_NAME_EMPTY))
        if (!phoneNumber) return res.send(errResponse2(baseResponse.SIGNUP_PHONENUMBER_EMPTY))

        const user = await userProvider.retrieveUser(phoneNumber)
        if (!user || user.Name != name) return res.send(errResponse2(baseResponse.USER_NOT_EXIST))

        const userEmail = user.Email.split('@')
        const block = userEmail[0].slice(0,-3) + '*'.repeat(3)
        user.Email = block + '@' + userEmail[1]
        user.result = true

        return res.send(user)
    }catch(err){
        console.log(err);
        return res.send(errResponse2(baseResponse.SIGNUP_SMS_WRONG))
    }

}

exports.findPassword = async(req,res) => {
    try {
        let tempPw = Math.random().toString(36).substring(2, 12);
        const  {userEmail}  = req.query;
        console.log(userEmail);

        if (!userEmail)
            return res.send(errResponse2(baseResponse.USER_USEREMAIL_EMPTY))

        const user = await userProvider.retrieveUserEmail(userEmail)
        if (!user) return res.send(errResponse2(baseResponse.USER_USEREMAIL_NOT_EXIST))

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "9659tig@gmail.com",
          pass: googleSecret,
        },
      });

      console.log(tempPw);
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

      return res.send(response2(baseResponse.SUCCESS))
    } catch (err) {
      console.log(err);
      return res.send(errResponse2(baseResponse.DB_ERROR))
    }

}

exports.editUserNickName = async(req,res) =>{
    const {email}  = req.query;
    const {nickname} = req.body

    if (!email) return res.send(errResponse2(baseResponse.USER_EDITINFO_EMPTYEMAIL))
    if (!nickname) return res.send(errResponse2(baseResponse.USER_NICKNAME_EMPTY))

    const eidtUser = await userService.editNickName(email, nickname)

    const userInfo = await userProvider.retrieveUserEmail(email);
    const newJwtResponse = await jwtLogin(userInfo)

    baseResponse.SUCCESS.accesstoken = newJwtResponse.accesstoken
    return res.send(baseResponse.SUCCESS)
}

exports.editUserName = async(req,res) =>{
    const {email}  = req.query;
    const {name} = req.body

    if (!email) return res.send(errResponse2(baseResponse.USER_EDITINFO_EMPTYEMAIL))
    if (!name) return res.send(response2(baseResponse.USER_NAME_EMPTY))

    const eidtUser = await userService.editName(email, name)

    const userInfo = await userProvider.retrieveUserEmail(email);
    const newJwtResponse = await jwtLogin(userInfo)

    baseResponse.SUCCESS.accesstoken = newJwtResponse.accesstoken
    return res.send(baseResponse.SUCCESS)
}

exports.editUserPhoneNumber = async(req,res) =>{
    const {email}  = req.query;
    const {phoneNumber} = req.body

    if (!email) return res.send(errResponse2(baseResponse.USER_EDITINFO_EMPTYEMAIL))
    if (!phoneNumber) return res.send(response2(baseResponse.SIGNUP_PHONENUMBER_EMPTY))

    if (phoneNumber.length != 11) return res.send(response2(baseResponse.SIGNUP_PHONENUMBER_LENGTH))

    const eidtUser = await userService.editPhoneNumber(email, phoneNumber)

    const userInfo = await userProvider.retrieveUserEmail(email);
    const newJwtResponse = await jwtLogin(userInfo)

    baseResponse.SUCCESS.accesstoken = newJwtResponse.accesstoken
    return res.send(baseResponse.SUCCESS)
}

exports.editUserPassword = async(req,res) =>{
    try {
        const {email}  = req.query;
        const {password} = req.body

        const invalidation = await validator.login(email, password);

        if (invalidation) return res.send(errResponse(invalidation));

        const editPasswordResponse = await userService.editPassword(email, password);

        return res.send(editPasswordResponse);}
    catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.editUserProfileImg = async(req,res)=> {
    const {email}  = req.query;

    if (!email) return res.send(errResponse2(baseResponse.USER_EDITINFO_EMPTYEMAIL))

    try{
        //sharp(req.file.path)
        //.resize({width:80})
        //.withMetadata() //이미지 크기 변경 시 손실되는 exif 데이터 유지 (이미지 방향 정보)
        ///*
        //.toBuffer((err,buff)=>{
        //    console.log(req.file.path);
        //    console.log(req)
        //    fs.writeFile("config/images/", buff, (err)=>{
        //        if (err) throw err
        //    })
        //})
        //*/
        //.toFile(`${req.file.path}/resize.png`, (err, info) => {
        //    if (err) throw err;
        //    console.log(`info : ${info}`);
        //    fs.unlink(`${req.file.path}/resize.png`, (err) => {
        //        if (err) throw err;
        //    });
        //});

        //const {id} = req.decoded
        //console.log(id);

        const eidtImage = await userService.eidtProfileImg(email, req.file.location, req.file.key)
        const userInfo = await userProvider.retrieveUserEmail(email);
        const newJwtResponse = await jwtLogin(userInfo)

        baseResponse.SUCCESS.photoUrl = req.file.location
        baseResponse.SUCCESS.accesstoken = newJwtResponse.accesstoken
        return res.send(baseResponse.SUCCESS)

    } catch(err){
        console.log(err);
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}

exports.withdrawal = async(req,res) => {
    //console.log(req);
    //const {userEmail}  = req.header('userEmail');
    const {userEmail}  = req.query;

    if (!userEmail) return res.send(errResponse2(baseResponse.USER_EDITINFO_EMPTYEMAIL))

    console.log(userEmail);

    const userWithdraw = await userService.deleteUser(userEmail)
    const userWithdrawFarm = await farmService.deleteUserFarm(userEmail)

    return res.send(userWithdraw)
}

exports.verfiyEmail = async (req, res) => {

    try {
        const userEmail = req.params.email;
        // if (!userEmail || userEmail.length < 1) return res.send(errResponse(resStatus.SIGNUP_EMAIL_EMPTY))
        if(validator.isValidEmail(userEmail) == false) return res.send(errResponse(resStatus.SIGNIN_EMAIL_ERROR_TYPE));

        const userInfo = await userProvider.usersbyEmail(userEmail);

        if (userInfo && userInfo.length > 0) return res.send(errResponse(resStatus.SIGNUP_REDUNDANT_EMAIL));

        else return res.send(response(resStatus_5000.USER_EMAIL_AVAILABLE));

    } catch (e) {
        res.send(errResponse(resStatus.SERVER_ERROR));
    }
}