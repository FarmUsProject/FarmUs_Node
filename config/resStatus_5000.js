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
    DATE_END_FASTER_THAN_FIRST : { "isSuccess": false, "code": 5002, "message": "시작날짜보다 마지막날짜가 앞서 있습니다." },
    DATE_TYPE_WEIRD : { "isSuccess": false, "code": 5003, "message": "날짜가  날짜 형식에 부합하지 않습니다."},
    
    
    //user
    USER_OAUTH_SIGNUP_REDUNDANT_EMAIL : {"isSuccess" : false, "code" : 5100, "message" : "해당 이메일을 가진 회원은 이미 등록되어 있습니다. 로그인을 진행해주세요."},
    USER_REDUNDANT_STAR :  {"isSuccess" : false, "code" : 5101, "message" : "이미 찜한 농장입니다."},
    USER_SIGNUP_SUCCESS : {"isSuccess" : true, "code" :  5150, "message" : "회원가입이 완료되었습니다."},
    USER_LOGIN_SUCCESS : {"isSuccess" : true, "code" :  5151, "message" : "로그인이 완료되었습니다."},
    USER_STAR_ADD_SUCCESS : { "isSuccess": true, "code": 5152, "message": "해당 농장을 찜 목록에 추가하였습니다." },
    USER_OAUTH_SIGNUP_SUCCESS : {"isSuccess" : true, "code" : 5153, "message" : "신규 소셜로그인 회원이 등록되었습니다."},
    USER_BIRTH_EDIT_SUCCESS : {"isSuccess" : true, "code" : 5154, "message" : "생일이 정상적으로 수정되었습니다."},

    
    //farm
    FARM_FARMID_NOT_EXIST  : { "isSuccess" : false, "code" : 5200, "message" : "해당 아이디를 가진 농장이 존재하지 않습니다."},
    FARM_NEW_DATA_SHORTAGE : {"isSuccess" : false, "code" : 5201, "message" : "농장을 등록하는 데 필요한 정보가 부족합니다."},
    FARM_DUPLICATED_EXISTS : {"isSuccess" : false, "code" : 5202, "message" : "이미 동일한 정보를 가진 농장이 존재합니다."},
    FARM_NEW_SAVE_SUCCESS : {"isSuccess" : true, "code" :  5250, "message" : "농장이 등록되었습니다."},
    
    //reserve
    RESERVE_REQUEST_DATA_SHORTAGE : { "isSuccess": false, "code": 5300, "message": "농장을 예약하는 데 필요한 정보가 부족합니다." },
    RESERVE_RESERVEID_NOT_EXIST : {"isSuccess" : false, "code" : 5301, "message" : "요청하신 예약 내역이 존재하지 않습니다."},
    RESERVE_DATE_FULL : { "isSuccess": false, "code": 5302, "message": "요청하신 기간에는 이미 다른 예약이 잡혀있습니다." },
    RESERVE_DATE_OFF_PERIOD_OF_FARM : { "isSuccess": false, "code": 5303, "message": "요청하신 기간에는 농장을 이용할 수 없습니다." },
    RESERVE_REQUEST_SUCCESS: { "isSuccess": true, "code": 5350, "message": "농장 예약이 완료되었습니다." },
    RESERVE_LIST_FARMS : {"isSuccess" : true, "code" : 5351, "message" : "예약하신 농장 목록을 불러왔어요."},
    RESERVE_LIST_CLIENTS : {"isSuccess" : true, "code" : 5352, "message" : "농장에 예약된 예약자 명단을 불러왔어요."},
    RESERVE_LIST_EMPTY : {"isSuccess" : true, "code" : 5353, "message" : "예약 목록이 없어요."},
    RESERVE_CANCEL_SUCCESS : { "isSuccess": true, "code": 5354, "message": "농장 예약이 취소되었습니다." },


}
