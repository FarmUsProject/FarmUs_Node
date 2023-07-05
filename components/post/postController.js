const Responce = require('../../config/response');
const { pool } = require('../../config/database');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM} = require("../../config/resStatus");
const postProvider = require("./postProvider");
const { response2, errResponse2 } = require('../../config/response2');
const baseResponse = require('../../config/resStatus');


exports.getPostings = async (req, res) => {
    const { FarmID } = req.params;

    if(!FarmID) return res.render(errResponse(FARMID_EMPTY));

    const getPostResult= await postProvider.retrievePostings(FarmID);
    return res.render(response(resStatus.SUCCESS, getPostResult));
}

exports.writePost = async (req, res) => {
    try{
        const { UserName, Comment, Star } = req.body;
        const { FarmID } = req.params;

        if(!FarmID) return res.render(errResponse(FARMID_EMPTY));

        const farmInfo = [UserName, Comment, Star, FarmID]
        const PostResult= await postProvider.postUpload(farmInfo);

        return res.send(baseResponse.SUCCESS)
    }catch(e){
        console.log(e);
    }


}