const response = ({result, code, message}) => {
    return {
         result: result,
         code: code,
         message: message,
    }
   };

   const errResponse = ({isSuccess, code, message}) => {
     return {
         isSuccess: isSuccess,
         code: code,
         message: message
       }
   };

   module.exports = { response, errResponse };