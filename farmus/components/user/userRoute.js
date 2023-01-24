module.exports = function(app){
    const user = require('./userController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');
    //const {connectRedis} = require('../../config/redisMiddleware')

    //app.use(connectRedis)

    app.post('/user/signup/verification/code',user.userAuthentication)
    app.post('/user/signup/verification',user.vertifyCode)

    //app.post('/user/find-account',user.userAuthentication,user.findAccount)
    app.get('/user/find-password',user.findPassword)
};