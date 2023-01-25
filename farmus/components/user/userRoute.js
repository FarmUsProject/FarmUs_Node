module.exports = function(app){
    const user = require('./userController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');
    //const {connectRedis} = require('../../config/redisMiddleware')

    //app.use(connectRedis)

    app.post('/user/signup/verification',user.userAuthentication)
    app.post('/user/verification',user.vertifyCode)

    app.get('/user/find-account',user.findAccount)
    app.get('/user/find-password',user.findPassword)

};