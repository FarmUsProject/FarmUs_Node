module.exports = function(app){
    const farm = require('./farmController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', farm.getTest)
};