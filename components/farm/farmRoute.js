module.exports = function(app){
    const farm = require('./farmController');

    app.get('/farm/search',farm.findFarms)

};