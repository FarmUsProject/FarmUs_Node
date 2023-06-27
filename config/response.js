const response = ({isSuccess = true, code, message}, result) => {
  return {
       isSuccess: isSuccess,
       code: code,
       message: message,
       result: result
  }
 };

 const errResponse = ({isSuccess = false, code, message}) => {
   return {
       isSuccess: isSuccess,
       code: code,
       message: message
     }
 };

 module.exports = { response, errResponse };