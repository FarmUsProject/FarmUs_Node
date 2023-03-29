module.exports = function(app){
    const reserve = require('./reserveController');

    // 1. 예약하기 API
    app.post('/reserve/request', reserve.request);

    // 2. 농장 예약현황 API : 한 농장의 예약자 명단
    app.get('/reserve/farm/list/:farmid', reserve.clientsList);

    // 3. 유저 예약현황 API : 한 유저가 예약한 농장 명단
    app.get('/reserve/client/list/:email', reserve.farmsList);

    // 4. 예약 취소
    app.put('/reserve/cancel/:reserveid', reserve.cancel);

    // 5. 예약 승낙
    app.put('/reserve/status/:id/:status', reserve.editStatus);

};