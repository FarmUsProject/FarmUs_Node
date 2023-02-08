module.exports = {

    /**
     * [CODE RULE IN 5000]
     * common  | 5000 ~ 5099
     * user    | 5100 ~ 5199
     * farm    | 5200 ~ 5299
     * reserve | 5300 ~ 5399
     * fail    | ##00 ~ ##49
     * success | ##50 ~ ##99
     */

    //common
    PARAMS_ONE_EMPTY: { "isSuccess": false, "code": 5000, "message": "파라미터가 존재하지 않습니다." },
    PARAMS_TWO_EMPTY: { "isSuccess": false, "code": 5001, "message": "필요한 두 파라미터 중 최소 하나가 존재하지 않습니다." },


    //user
    USER_SIGNUP_SUCCESS : {"isSuccess" : true, "code" :  5150, "message" : "회원가입이 완료되었습니다."},
    USER_LOGIN_SUCCESS : {"isSuccess" : true, "code" :  5151, "message" : "로그인이 완료되었습니다."},
    USER_STAR_ADD_SUCCESS : { "isSuccess": true, "code": 5152, "message": "해당 농장을 찜 목록에 추가하였습니다." },


    //farm
    FARM_FARMID_NOT_EXIST  : { "isSuccess" : false, "code" : 5200, "message" : "해당 아이디를 가진 농장이 존재하지 않습니다."},
    FARM_NEW_DATA_SHORTAGE : {"isSuccess" : false, "code" : 5201, "message" : "농장을 등록하는 데 필요한 정보가 부족합니다."},
    FARM_DUPLICATED_EXISTS : {"isSuccess" : false, "code" : 5202, "message" : "이미 동일한 정보를 가진 농장이 존재합니다."},
    FARM_NEW_SAVE_SUCCESS : {"isSuccess" : true, "code" :  5250, "message" : "농장이 등록되었습니다."},

    //reserve
    RESERVE_REQUEST_DATA_SHORTAGE : { "isSuccess": false, "code": 5300, "message": "농장을 예약하는 데 필요한 정보가 부족합니다." },
    RESERVE_RESERVEID_NOT_EXIST : {"isSuccess" : false, "code" : 5301, "message" : "요청하신 예약 내역이 존재하지 않습니다."},
    RESERVE_REQUEST_SUCCESS: { "isSuccess": true, "code": 5350, "message": "농장 예약이 완료되었습니다." },
    RESERVE_LIST_FARMS : {"isSuccess" : true, "code" : 5351, "message" : "예약하신 농장 목록을 불러왔어요."},
    RESERVE_LIST_CLIENTS : {"isSuccess" : true, "code" : 5352, "message" : "농장에 예약된 예약자 명단을 불러왔어요."},
    RESERVE_LIST_EMPTY : {"isSuccess" : true, "code" : 5353, "message" : "예약 목록이 없어요."},
    RESERVE_CANCEL_SUCCESS : { "isSuccess": true, "code": 5354, "message": "농장 예약이 취소되었습니다." },


}
