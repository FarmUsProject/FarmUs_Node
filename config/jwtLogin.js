const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/secret');

async function jwtLogin(user) {
    const secretKey = jwtConfig.secretKey;
    const options = jwtConfig.options;

    const payload = {
        name: user.Name,
        nickName: user.NickName,
        email: user.Email,
        role: user.Role,
        phoneNumber : user.PhoneNumber,
        profile : user.Picture_url
    };
    return ({
        accesstoken: jwt.sign(payload, secretKey, options),
        name: user.Name,
        nickName: user.NickName,
        email: user.Email,
        role: user.Role,
        phoneNumber: user.PhoneNumber,
        profile : user.Picture_url,
        status: true,
    })
}

module.exports = jwtLogin;