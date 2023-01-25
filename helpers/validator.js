const resStatus = require('../config/resStatus')

const validator = {

  login : async (email, password) => {
    if (!email) {
        return resStatus.SIGNIN_EMAIL_EMPTY
    }
    if (email.length >= 30) {
        return resStatus.SIGNIN_EMAIL_LENGTH
    }
    if (!password){
        return resStatus.SIGNIN_PASSWORD_EMPTY
    }
    if (password.length < 6 || password.length > 20){
        return resStatus.SIGNUP_PASSWORD_LENGTH
    }
    return false; //validation 통과
  },

  farm : async () => {
    return false;
  },
}

module.exports = validator;