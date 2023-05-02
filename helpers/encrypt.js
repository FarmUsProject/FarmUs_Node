const util = require("util");
const crypto = require("crypto");
const pbkdf2Promise = util.promisify(crypto.pbkdf2); 
const randomBytesPromise = util.promisify(crypto.randomBytes); 

const encryptedPassword = {

  createHashedPassword : async (password) => {
    const salt = await encryptedPassword.createSalt()
    const key = await pbkdf2Promise(password, salt, 108273, 64, "sha512");
    const hashedPassword = await key.toString("base64");
  
    return { hashedPassword, salt };
  },

  createSalt : async () => {
    const element = await randomBytesPromise(64);
    return element.toString("base64");
  },
  
  verifyPassword : async (password, salt, userPassword) => {
    const key = await pbkdf2Promise(password, salt, 108273, 64, "sha512");
    const hashedPassword = key.toString("base64");
    console.log("[uu]",hashedPassword);
    console.log("[db]",userPassword);
     if (hashedPassword === userPassword) return true;
     else return false;
  }
}

module.exports = encryptedPassword;