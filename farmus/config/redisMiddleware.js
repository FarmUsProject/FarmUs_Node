const baseResponse = require('../config/resStatus');
const redis = require('redis')
const {REDIS} = require('../config/secret')

let client = ''
const connectRedis = async(req,res,next) => {
    try{
        const redisClient = await redis.createClient({
            url: `redis://${REDIS.USERNAME}:${REDIS.PASSWORD}@${REDIS.HOST}:${REDIS.PORT}/0`,
            legacyMode: true,
        })
        console.log(redisClient);
        console.log("=====");
        redisClient.on('connect',()=>{
            console.log('Redis Connected');
        })
        redisClient.on('error',(err)=>{
            console.log('Redis Client Error',err)
        })
        redisClient.connect().then()
        client = redisClient.v4
        console.log(client);
        next()
    }catch(err){
        console.log(baseResponse.REDIS_ERROR);
        return res.send(response(baseResponse.REDIS_ERROR))
    }
}

module.exports = {connectRedis, client}