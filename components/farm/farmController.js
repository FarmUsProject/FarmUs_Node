const baseResponse = require('../../config/resStatus');
const { response, errResponse } = require("../../config/response")
const farmProvider = require('./farmProvider')

exports.findFarms = async (req,res) => {
    const {keyword} = req.query

    if (!keyword) return res.send(errResponse(baseResponse.FARM_NOT_KEYWORD))

    const farms = await farmProvider.retrieveFarms(keyword)
    return res.send(farms)
}