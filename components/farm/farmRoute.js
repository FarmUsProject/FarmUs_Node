const uploadImg = require('./farmMiddleware/imgUpload')
const deleteImg = require('./farmMiddleware/imgDelete')

module.exports = function (app) {
    const farm = require('./farmController');

    //농장 등록
    app.post('/farm/postings',uploadImg, farm.newFarm);

    //농장목록 조회
    app.get("/farm/list/:email", farm.getFarmlist);

    //농장 세부사항 조회
    app.get("/farm/detail/:farmid", farm.getFarmDetail);

    //농장주 등록
    app.patch("/farm/register", farm.postFarmer);

    //농장 검색
    app.get('/farm/search',farm.findFarms);

    //농장 필터링
    app.get('/farm',farm.filter)

    //농장 글 수정
    app.patch('/farm/editInfo',uploadImg ,farm.editFarm);

    //농장 사진 삭제
    app.delete('/farm/deletePhoto',deleteImg, farm.deletePhoto);

    //농장주 핸드폰 번호 조회
    app.get('/farm/farmerPhoneNumber', farm.getPhoneNumber);

    //좋아요 농장 목록 반환
    app.get('/farm/likes',farm.getLikes);

    //보유 농장 조회
    app.get('/farm/myfarm', farm.getMyFarm);

    //(farmDate) 농장 예약 불가 기간 등록
    app.post('/farm/unavailableDate', farm.addFarmDate);

    //(farmDate) 농장 예약 불가 기간 삭제
    app.put('/farm/unavailableDate/delete/:farmDateID', farm.deleteFarmDate);

    //(farmDate) 농장 예약 불가 기간 목록
    app.get('/farm/unavailableDate/:farmid', farm.getFarmDate);

};