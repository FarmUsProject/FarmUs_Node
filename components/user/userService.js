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

exports.editNickName = async (email,nickname) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updateNickName(connection, email, nickname)
        connection.release()
        if (res)
            return response(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}

exports.editName = async (email,name) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updateName(connection, email, name)
        connection.release()
        if (res)
            return response(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}

exports.editPhoneNumber = async (email,phoneNumber) =>{
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.updatePhoneNum(connection, email, phoneNumber)
        connection.release()
        if (res)
            return response(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}

exports.eidtUserStatus = async (email) => {
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.withdrawalUser(connection, email)

        connection.release()

        if (res) return response(baseResponse.SUCCESS)

    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}

exports.eidtProfileImg = async(email, img) => {
    try{
        const connection = await pool.getConnection(async (conn)=>conn)
        const res = await userDao.eidtProfileImg(connection, email, img)

        connection.release()

        if (res) return response(baseResponse.SUCCESS)
    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR)
    }
}