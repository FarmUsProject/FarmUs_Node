const resStatus = require('../config/resStatus')

const validator = {

  login: async (email, password) => {
    if (!email) {
      return resStatus.SIGNIN_EMAIL_EMPTY
    }
    if (email.length >= 30) {
      return resStatus.SIGNIN_EMAIL_LENGTH
    }
    if (!password) {
      return resStatus.SIGNIN_PASSWORD_EMPTY
    }
    if (password.length < 6 || password.length > 20) {
      return resStatus.SIGNUP_PASSWORD_LENGTH
    }
    return false; //validation 통과
  },

  signUp: async (email, password, phoneNumber, nickName, name, role) => {
    const invalidation = await this.login(email, password);
    if (invalidation) return invalidation

    if (!phoneNumber) return resStatus.SIGNUP_PHONENUMBER_EMPTY
    if (!nickName) return resStatus.SIGNUP_NICKNAME_EMPTY
    if (!name) return resStatus.SIGNUP_NICKNAME_EMPTY
    if (!role) return resStatus.USER_STATUS_EMPTY
    if (nickName.length > 20) return resStatus.SIGNUP_NICKNAME_LENGTH
    if (name.length > 20) return resStatus.SIGNUP_NICKNAME_LENGTH
    if (role.length >= 2) return resStatus.USER_STATUS_EMPTY

    return false;
  },

  newFarm: async (name, owner, picture_url, price, squaredMeters, location, description) => {
    if (!name || !owner || !picture_url || !price || !squaredMeters || !location)
      return { "isSuccess": false, "code": 2012, "message": "농장을 등록하는 데 필요한 정보를 모두 입력해주세요." };

    return false;
  },
}

module.exports = validator;