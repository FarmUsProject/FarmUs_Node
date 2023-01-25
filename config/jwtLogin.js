const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/secret');

async function jwtLogin(user) {
    const secretKey = jwtConfig.secretKey;
    const options = jwtConfig.options;
    const payload = {
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        role: user.role,
    };
    return ({
        accesstoken: jwt.sign(payload, secretKey, options),
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        role: user.role,
        status: true,
    })
}

module.exports = { jwtLogin }