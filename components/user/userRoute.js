module.exports = function(app){
    const user = require('./userController');

    // 1. 로그인 API
    app.post('/user/login', user.login)

    // 2. 회원가입 API
    app.post('/user/signup', user.signup)

    // 8. 농장 찜하기 API
    app.post('/user/star', user.star)
};