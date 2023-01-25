module.exports = {

    // Success
    SUCCESS : { "result": true},

    // Common
    FARMID_EMPTY : {"result" : false, "code": 1002, "message": "FARMID 값이 비어있습니다."},
    TOKEN_EMPTY : { "result": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "result": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "result": true}, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "result": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "result": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "result": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "result": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "result": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "result": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "result": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_PHONENUMBER_EMPTY : { "result": false, "code": 2019, "message":"핸드폰번호를 입력 해주세요." },

    SIGNIN_EMAIL_EMPTY : { "result": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "result": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "result": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "result": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "result": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "result": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "result": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "result": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "result": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "result": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },
    DELETED_FARM : {"result": false, "code": 2019, "message": "해당 농장은 삭제되었습니다."},

    USER_STATUS_EMPTY : { "result": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "result": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "result": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "result": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "result": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "result": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "result": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "result": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "result": false, "code": 4001, "message": "서버 에러"},


}
