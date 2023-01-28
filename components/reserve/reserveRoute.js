module.exports = function(app){

    const reserve = require('./reserveController');
    // 1. 예약하기 API
    app.post('/reserve/request', reserve.request);

    // 2. 농장 예약현황 API : 한 농장의 예약자 명단
    app.put('/reserve/farm/list/:farmid', reserve.clientsList);


};