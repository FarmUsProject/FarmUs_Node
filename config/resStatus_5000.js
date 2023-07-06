module.exports = {

    /**
     * [CODE RULE IN 5000]
     * common  | 5000 ~ 5099
     * user    | 5100 ~ 5199
     * farm    | 5200 ~ 5299
     * reserve | 5300 ~ 5399
     * district| 5400 ~ 5499
     * fail    | ##00 ~ ##49
     * success | ##50 ~ ##99
     */

    //common
    PARAMS_ONE_EMPTY: { "isSuccess": false, "code": 5000, "message": "파라미터가 존재하지 않습니다." },
    PARAMS_TWO_EMPTY: { "isSuccess": false, "code": 5001, "message": "필요한 두 파라미터 중 최소 하나가 존재하지 않습니다." },
    DATE_END_FASTER_THAN_START : { "isSuccess": false, "code": 5002, "message": "시작 날짜보다 마지막 날짜가 앞서 있습니다. 올바른 기간을 설정해주세요." },
    DATE_TYPE_WEIRD : { "isSuccess": false, "code": 5003, "message": "날짜 형식에 부합하지 않습니다."},
    DATE_START_FASTER_THAN_NOW : { "isSuccess": false, "code": 5004, "message": "시작 날짜는 오늘 날짜 이후로 설정할 수 있습니다."},

    //user
    USER_OAUTH_SIGNUP_REDUNDANT_EMAIL : {"isSuccess" : false, "code" : 5100, "message" : "해당 이메일을 가진 회원은 이미 등록되어 있습니다. 로그인을 진행해주세요."},
    USER_REDUNDANT_STAR :  {"isSuccess" : false, "code" : 5101, "message" : "이미 찜한 농장입니다."},
    USER_NOT_FARMER :  {"isSuccess" : false, "code" : 5102, "message" : "농장주만 농장을 등록할 수 있어요."},
    USER_SIGNUP_SUCCESS : {"isSuccess" : true, "code" :  5150, "message" : "회원가입이 완료되었습니다."},
    USER_LOGIN_SUCCESS : {"isSuccess" : true, "code" :  5151, "message" : "로그인이 완료되었습니다."},
    USER_STAR_ADD_SUCCESS : { "isSuccess": true, "code": 5152, "message": "해당 농장을 찜 목록에 추가하였습니다." },
    USER_OAUTH_SIGNUP_SUCCESS : {"isSuccess" : true, "code" : 5153, "message" : "신규 소셜로그인 회원이 등록되었습니다."},
    USER_BIRTH_EDIT_SUCCESS : {"isSuccess" : true, "code" : 5154, "message" : "생일이 정상적으로 수정되었습니다."},
    USER_PASSWORD_EDIT_SUCCESS : {"isSuccess" : true, "code" : 5155, "message" : "비밀번호가 정상적으로 변경되었습니다."},
    USER_EMAIL_AVAILABLE : {"isSuccess" : true, "code" : 5155, "message" : "사용가능한 이메일입니다."},

    //farm
    FARM_FARMID_NOT_EXIST  : { "isSuccess" : false, "code" : 5200, "message" : "해당 아이디를 가진 농장이 존재하지 않습니다."},
    FARM_NEW_DATA_SHORTAGE : {"isSuccess" : false, "code" : 5201, "message" : "농장을 등록하는 데 필요한 정보가 부족합니다."},
    FARM_UPDATE_STAR_ERROR : {"isSuccess" : false, "code" :  5202, "message" : "농장의 찜 개수를 업데이트 하는 데 실패했습니다."},
    FARM_DUPLICATED_EXISTS : {"isSuccess" : false, "code" : 5202, "message" : "이미 동일한 정보를 가진 농장이 존재합니다."},
    FARM_NEW_SAVE_SUCCESS : {"isSuccess" : true, "code" :  5250, "message" : "농장이 등록되었습니다."},
    FARM_LIST_AVAILABLE_FOR_RESERVATION : {"isSuccess" : true, "code" :  5251, "message" : "예약 가능한 농장 목록을 불러왔어요."},
    FARM_DETAIL_GET_SUCCESS : {"isSuccess" : true, "code" :  5252, "message" : "농장 상세 정보를 불러왔어요."},
    
    //reserve
    RESERVE_REQUEST_DATA_SHORTAGE : { "isSuccess": false, "code": 5300, "message": "농장을 예약하는 데 필요한 정보가 부족합니다." },
    RESERVE_RESERVEID_NOT_EXIST : {"isSuccess" : false, "code" : 5301, "message" : "요청하신 예약 내역이 존재하지 않습니다."},
    RESERVE_DATE_OFF_PERIOD_OF_FARM : { "isSuccess": false, "code": 5303, "message": "요청하신 기간에는 농장을 이용할 수 없습니다." },
    RESERVE_STATUS_ERROR : { "isSuccess": false, "code": 5304, "message": "잘못된 농장 예약 상태를 요청하였습니다. 농장 예약의 상태 변경에 실패했습니다." },
    RESERVE_CANCEL_NOT_ALLOWED : { "isSuccess": false, "code": 5305, "message": "예약 확정 상태에서는 예약을 취소할 수 없습니다." },
    RESERVE_REQUEST_SUCCESS: { "isSuccess": true, "code": 5350, "message": "농장 예약이 완료되었습니다." },
    RESERVE_LIST_FARMS : {"isSuccess" : true, "code" : 5351, "message" : "예약하신 농장 목록을 불러왔어요."},
    RESERVE_LIST_CLIENTS : {"isSuccess" : true, "code" : 5352, "message" : "농장에 예약된 예약자 명단을 불러왔어요."},
    RESERVE_LIST_EMPTY : {"isSuccess" : true, "code" : 5353, "message" : "예약 목록이 없어요."},
    RESERVE_CANCEL_SUCCESS : { "isSuccess": true, "code": 5354, "message": "농장 예약이 취소되었습니다." },
    RESERVE_STATUS_ACCPET_SUCCESS : { "isSuccess": true, "code": 5355, "message": "농장 예약을 승인하였습니다." },
    RESERVE_STATUS_HOLD_SUCCESS : { "isSuccess": true, "code": 5356, "message": "농장 예약을 보류하였습니다." },
    RESERVE_STATUS_DENIED_SUCCESS : { "isSuccess": true, "code": 5357, "message": "농장 예약 거부했습니다." },
    RESERVE_DATE_FULL : { "isSuccess": true, "code": 5358, "message": "요청하신 기간에는 이미 다른 예약이 잡혀있습니다." },
    
    //district
    DISTRICT_AUTH_FAIL : { "isSuccess": false, "code": 5400, "message": "주소 유효성 검사에 실패하였습니다."},
    DISTRICT_CODE_FAIL : { "isSuccess": false, "code": 5401, "message": "주소 유효성 검사에 실패하였습니다."},
    DISTRICT_NOT_EXIST : { "isSuccess": false, "code": 5402, "message": "잘못된 주소입니다. 정확한 주소를 입력해주세요"},
    DISTRICT_CLEAR : { "isSuccess": true, "code": 5451, "message": "주소 유효성 검사를 완료하였습니다."},
    
}
