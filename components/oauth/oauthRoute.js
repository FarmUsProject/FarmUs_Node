module.exports = function(app){
    const oauth = require('./oauthController');

    // 1. 소셜로그인 회원등록 API
    app.post('/oauth/kakao/signup', oauth.signup)
};