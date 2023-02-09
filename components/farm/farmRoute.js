module.exports = function(app){
    const farm = require('./farmController');

    // 6. 농장 등록
    app.post('/farm/postings', farm.newFarm)
};