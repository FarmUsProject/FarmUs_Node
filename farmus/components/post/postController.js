const Responce = require('../../config/response');
const { pool } = require('../../config/database');
const { response, errResponse } = require('../../config/response');
const resStatus = require('../../config/resStatus');
const {FARMID_EMPTY, DELETED_FARM} = require("../../config/resStatus");
const postProvider = require("./postProvider");

exports.getPostings = async (req, res) => {
    const { FarmID } = req.params;

    if(!FarmID) return res.render(errResponse(FARMID_EMPTY));

    const getPostResult= await postProvider.retrievePostings(FarmID);
    return res.render(response(resStatus.SUCCESS, getPostResult));
}

exports.writePost = async (req, res) => {
    const { UserName, Comment, Star } = req.body;

    const { FarmID } = req.params;

    if(!FarmID) return res.render(errResponse(FARMID_EMPTY));

    const PostResult= await postProvider.retrievePosting(
        FarmID,
        UserName,
        Comment,
        Star
    );


    return res.render(PostResult);

}