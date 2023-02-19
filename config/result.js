const result = ({result, code, message}) => {
    return {
         result: result,
         code: code,
         message: message,
    }
   };

   const errResult = ({result, code, message}) => {
     return {
         result: result,
         code: code,
         message: message
       }
   };

module.exports = { result, errResult };