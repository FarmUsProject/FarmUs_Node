const axios = require('axios')
const secret = require('../config/secret.js');
const resStatus_5000 = require('../config/resStatus_5000');
const { response, errResponse } = require("../config/response");
const KOR_DIST = secret.KOR_DIST;

const districtClarity = {
    accessToken: null,
    tokenExpiration: null,
    getAccessToken: async function () {
        try {
            if (this.accessToken && Date.now() < this.tokenExpiration) {
                return true;
            } else {
                const response = await axios.get(KOR_DIST.URL_AUTH, {
                    params: {
                        "consumer_key": KOR_DIST.SERVICEID,
                        "consumer_secret": KOR_DIST.SECRET_KEY
                    }
                });
                this.accessToken = response.data.result.accessToken;
                this.tokenExpiration = response.data.result.accessTimeout;
                console.log("*[districtClarity] Getting Accesstoken Succeeded. Expires in 4 hours");
            }
            // console.log(Date.now(), "now");
            // console.log(this.tokenExpiration, "tokenExpiration");
            // console.log(this.accessToken, "accessToken");
            return true;
        } catch (e) {
            return false;
        }
    },

    getLocationCode: async function (locationCode, target) {
        let paramsData;
        if (locationCode && locationCode.length > 0) {
            paramsData = {
                "accessToken": this.accessToken,
                "cd": locationCode
            }
        }
        else
            paramsData = { "accessToken": this.accessToken }

        return await axios.get(KOR_DIST.URL_REQ, { params: paramsData }).then(
            function (response) {
                let resultArr = response.data.result;
                for (let item of resultArr) {
                    if (item.addr_name == target)
                        return item.cd;
                }
                return null;
            }
        );
    },

    checkLocation: async function (locationBig, locationMid, locationSmall) {
        if (await this.getAccessToken() == false)
            return errResponse(resStatus_5000.DISTRICT_AUTH_FAIL);

        try {
            let locationCode = null;
            locationCode = await this.getLocationCode(locationCode, locationBig);
            locationCode = await this.getLocationCode(locationCode, locationMid);
            if (locationSmall) // tmp
                locationCode = await this.getLocationCode(locationCode, locationSmall);
            if (!locationCode || locationCode.length < 5) //tmp 
                return errResponse(resStatus_5000.DISTRICT_NOT_EXIST);
            return response(resStatus_5000.DISTRICT_CLEAR, locationCode);
        }
        catch {
            return errResponse(resStatus_5000.DISTRICT_CODE_FAIL);
        }
    }
}

module.exports = districtClarity;