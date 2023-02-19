const user = require("./userController");
module.exports = function(app){
    const user = require('./userController');

    //user CurUse_farm 가져오기
    app.get("farm/get_befoArray:userid", user.getBefoFarmUsed_Array);

    app.get("farm/get_curArray:userid", user.getCurFarmUse_Array);
};