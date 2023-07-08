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

    // 5. 예약 상태 변경 - 예약 승낙, 예약 보류, 예약 거부
    app.put('/reserve/:status/:reserveid', reserve.editStatus);

    // 6. 유저 별 현재 이용중인 농장 목록
    app.get('/reserve/current/list/:email', reserve.currentUse);

    // 7. 유저 별 과거 이용중인 농장 목록
    app.get('/reserve/past/list/:email', reserve.pastUse);

    // 8. 농장별 예약 불가 기간 조회
    // app.get('/reserve/unavailable/farmid', reserve.unavaliablePeriod);
};