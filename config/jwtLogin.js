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
    };
    return ({
        accesstoken: jwt.sign(payload, secretKey, options),
        name: user.Name,
        nickName: user.NickName,
        email: user.Email,
        role: user.Role,
        status: true,
    })
}

module.exports = jwtLogin; 