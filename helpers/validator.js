const resStatus = require('../config/resStatus')
const resStatus_5000 = require('../config/resStatus_5000')

const validator = {

  login: async (email, password) => {
    if (!email) {
      return resStatus.SIGNUP_EMAIL_EMPTY
    }
    if (email.length >= 30) {
      return resStatus.SIGNUP_EMAIL_LENGTH
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
    const invalidation = await validator.login(email, password);
    if (invalidation) return invalidation

    if (!phoneNumber) return resStatus.SIGNUP_PHONENUMBER_EMPTY
    // if (!nickName) return resStatus.SIGNUP_NICKNAME_EMPTY
    if (!name) return resStatus.SIGNUP_NICKNAME_EMPTY
    if (!role) return resStatus.USER_STATUS_EMPTY
    // if (nickName.length > 20) return resStatus.SIGNUP_NICKNAME_LENGTH
    if (name.length > 20) return resStatus.SIGNUP_NICKNAME_LENGTH
    if (role.length >= 2) return resStatus.USER_STATUS_EMPTY

    return false;
  },

  oauthSignup : async (email, phoneNumber, name, role) => {

    if (!email) return resStatus.SIGNIN_EMAIL_EMPTY

    if (!phoneNumber) return resStatus.SIGNUP_PHONENUMBER_EMPTY

    if (!name) return resStatus.SIGNUP_NICKNAME_EMPTY

    return false;
  },

  newFarm: async (name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid) => {
    if (!name || !owner || !startDate || !endDate || !price || !squaredMeters || !locationBig || !locationMid)
      return resStatus_5000.FARM_NEW_DATA_SHORTAGE;

    return false;
  },

  newReservation: async (userEmail, farmid, startDate, endDate) => {
    if (!userEmail || !farmid || !startDate || !endDate)
      return resStatus_5000.RESERVE_REQUEST_DATA_SHORTAGE;

    return false;
  },

  oneParams : async (aParam) => {
    if (!aParam)
      return resStatus_5000.PARAMS_ONE_EMPTY;

    return false;
  },

  twoParams : async (firstParam, SecParam) => {
    if (!firstParam || !SecParam)
      return resStatus_5000.PARAMS_TWO_EMPTY;

    return false;
  },

  isValidEmail: (email) => {
    const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    return emailPattern.test(email);
  }
}

module.exports = validator;