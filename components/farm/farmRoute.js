module.exports = function(app){
    const farm = require('./farmController');

    // 0. 테스트 API
    app.get('/app/test', farm.getTest)

    // 3. 예약한 농장
    app.put('/farm/postings/:postid', farm.bookedFarm)

    // 6. 농장 등록
    app.post('/farm/postings', farm.newFarm)
};