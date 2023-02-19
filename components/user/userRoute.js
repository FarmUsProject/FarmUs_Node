module.exports = function(app){
    const user = require('./userController');

    // 1. 로그인 API
    app.post('/user/login', user.login)

    // 2. 회원가입 API
    app.post('/user/signup', user.signup)

    //user CurUse_farm 가져오기
    app.get("farm/get_befoArray:userid", user.getBefoFarmUsed_Array);

    app.get("farm/get_curArray:userid", user.getCurFarmUse_Array);

    // 8. 농장 찜하기 API
    app.post('/user/star', user.star)

    //9. 생일 등록 API
    app.post('/user/birth', user.birth)
};