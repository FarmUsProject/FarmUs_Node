const response = ({result, code, message}) => {
    return {
         result: result,
         code: code,
         message: message,
    }
   };

   const errResponse = ({result, code, message}) => {
     return {
         result: result,
         code: code,
         message: message
       }
   };

   module.exports = { response, errResponse };