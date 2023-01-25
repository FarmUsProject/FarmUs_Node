module.exports = function(app){
    const farm = require('./farmController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', farm.getTest)

    // 3. 예약한 농장
    app.put('/farm/postings/:postid', farm.reserve)

    // 6. 농장 등록
    app.post('/farm/postings', farm.post)
};