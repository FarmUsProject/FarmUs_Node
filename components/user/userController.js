const baseResponse = require("../../config/resStatus");
const {response, errResponse} = require("../../config/response");
const {FARMID_EMPTY} = require("../../config/resStatus");
const userProvider = require("./userProvider");


exports.getBefoFarmUsed_Array = async (req, res, error) => {
    const {userid} = req.params;

    if(!userid) return res.render(errResponse(FARMID_EMPTY));

    const getUsedFarmArray = userProvider.retrieveUsedFarmArray(userid);
    res.render(getUsedFarmArray);
}

exports.getCurFarmUse_Array = async (req, res, error) => {
    const {userid} = req.params;

    if(!userid) return res.render(errResponse(FARMID_EMPTY));

    const getCurFarmArray = userProvider.retrieveCurFarmArray(userid);
    res.render(getCurFarmArray);
}