module.exports = function(app){
    const user = require('./userController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 로그인 API
    app.post('/user/login', user.login)

    // 2. 회원가입 API
    app.post('/user/signup', user.signup)
};