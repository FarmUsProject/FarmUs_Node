const response2 = ({result, code, message}) => {
    return {
         result: result,
         code: code,
         message: message,
    }
};

   const errResponse2 = ({result, code, message}) => {
     return {
         result: result,
         code: code,
         message: message
       }
   };

module.exports = { response2, errResponse2 };