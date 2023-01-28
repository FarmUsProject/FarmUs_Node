module.exports = function(app){

    const reserve = require('./reserveController');
    // 1. 예약하기 API
    app.post('/reserve/request', reserve.request)

};