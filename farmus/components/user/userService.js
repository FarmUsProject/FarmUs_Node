// Service: Create, Update, Delete 비즈니스 로직 처리
const { pool } = require("../../config/database");
const { response, errResponse } = require('../../config/response')
const userDao = require('./userDao')
const baseResponse = require('../../config/resStatus')

exports.editPassword = async (email,pw) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updatePassword(connection, email, pw)
        connection.release()
        if (res)
            return response(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}