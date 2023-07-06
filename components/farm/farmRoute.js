const uploadImg = require('./farmMiddleware/imgUpload')

module.exports = function (app) {
    const farm = require('./farmController');

    //농장 등록
    app.post('/farm/postings', farm.newFarm);

    //농장목록 조회
    app.get("/farm/list/:email", farm.getFarmlist);

    //농장 세부사항 조회
    app.get("/farm/detail/:farmid", farm.getFarmDetail);

    //과거 이용 내역 조회
    app.get("/farm/befolist:userid", farm.getFarmUsedList);

    //현재 이용 내역 조회
    app.get("/farm/curlist:userid", farm.getFarmUseList);

    //농장주 등록
    app.patch("/farm/register", farm.postFarmer);

    //농장 검색
    app.get('/farm/search',farm.findFarms);

    //농장 글 수정
    app.patch('/farm/editInfo',uploadImg ,farm.editFarm);
};