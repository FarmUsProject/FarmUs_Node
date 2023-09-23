const FarmProvider = require('./farmProvider');
const farmDao = require('./farmDao');
const { pool } = require('../../config/database');
const { response, errResponse } = require('./../../config/response');
const resStatus_5000 = require('./../../config/resStatus_5000');
const randomNumber = require('../../helpers/randomNumber');
const setDate = require('./../../helpers/setDate');
const { response2, errResponse2 } = require('../../config/response2');
const baseResponse = require('../../config/resStatus');
const { eidtFarm } = require('./farmController');
const resStatus = require('../../config/resStatus');
const userProvider = require('./../user/userProvider');
const withConnection = require('../../config/connection')

exports.postFarmer = withConnection(async (connection, email) => {
    const res = await farmDao.userToFarmer(connection, email);
    return res;
});

exports.newFarm = withConnection(async (connection, name, owner, price, squaredMeters, locationBig, locationMid, locationSmall, description) => {
    const sameFarmInfo = [name, owner, price, squaredMeters, locationBig, locationMid, locationSmall];
    const isSameFarm = await FarmProvider.isSameFarm(sameFarmInfo); //중복체크
    if (isSameFarm) return errResponse(resStatus_5000.FARM_DUPLICATED_EXISTS);

    const newFarmStatus = 'A';
    let newFarmID;
    let existedFarm;
    do {
        newFarmID = await randomNumber.createFarmID();
        existedFarm = await FarmProvider.farmbyfarmID(newFarmID);
    } while (existedFarm); //unique farmID

    const now = await setDate.now();

    const newFarmInfo = [newFarmID, name, owner, price, squaredMeters, locationBig, locationMid, locationSmall, description, newFarmStatus, now, now];

    const newFarm = await farmDao.insertFarm(connection, newFarmInfo);
    return response(resStatus_5000.FARM_NEW_SAVE_SUCCESS, { "newFarmID": newFarmID });
});

exports.deleteUserFarm = withConnection(async (connection, email) => {
    const res = await farmDao.withdrawalUserFarm(connection, email);
    if (res) return response2(baseResponse.SUCCESS);
});

exports.editFarmInfo = withConnection(async (connection, farmID, farmInfo) => {
    const res = await farmDao.eidtMyFarm(connection, farmID, farmInfo);
    return res;
});

exports.editFarmPictures = withConnection(async (connection, farmID, farmName, img, key) => {
    const res = await farmDao.editFarmPicture(connection, farmID, farmName, img, key)
    return res;
});

exports.getFarmDetail = async (farmID) => {
    try {
        const farmInformation = await FarmProvider.retrieveFarmInfo(farmID);
        const farmPictureUrlInformation = await FarmProvider.farmPictureUrlbyFarmID(farmID);
        const userInformation = await userProvider.usersbyEmail(farmInformation[0].Owner);

        //최종 농장 세부사항
        let farmDetail = farmInformation[0];

        //농장 항목 삭제 : Owner, crateAt, updateAt
        delete farmDetail.Owner;
        //delete farmDetail.createAt;
        //delete farmDetail.updateAt;

        // 농장 사진 추가 : Picture_url, Picture_key
        let pictureObject;
        if(farmPictureUrlInformation && farmPictureUrlInformation.length > 0 ) {
            pictureObject = farmPictureUrlInformation.map(({ Picture_url, Picture_key }) => ({
                Picture_url,
                Picture_key
              }));
        }
        else  pictureObject = null;
        farmDetail.PictureObject = pictureObject;

        //농장주 정보 추가 : Email, PhoneNumber, Name, NickName
        let userInfo = {
            Email : userInformation[0].Email,
            Name : userInformation[0].Name,
            NickName : userInformation[0].NickName,
            Picture_url : userInformation[0].Picture_url || null,
            Picture_key : userInformation[0].Picture_key || null
        }
        farmDetail.farmer = userInfo;

        return response(resStatus_5000.FARM_DETAIL_GET_SUCCESS, farmDetail);

    } catch(err) {
        return errResponse(resStatus.DB_ERROR);
    }
}


exports.getFarmList = async (email) => {
    // try {
        const farmList = await FarmProvider.retrieveFarmlist();
        const farmPictureInformation = await FarmProvider.farmPictureUrl();
        const userInformation = await userProvider.usersbyEmail(email);
        let likeFarmIDs;

        //picture_url & picture_key
        farmList.forEach(farm => {
            const matchingPictures = farmPictureInformation.filter(p => p.FarmID === farm.FarmID);
            const pictureObjects = matchingPictures.map(p => ({
              Picture_url: p.Picture_url,
              Picture_key: p.Picture_key
            }));
            farm.Pictures = pictureObjects;
          });

        //like
        if (userInformation.length > 0 && userInformation[0].LikeFarmIDs) {
            likeFarmIDs = userInformation[0].LikeFarmIDs.split(',').map(id => id.trim());
            console.log(likeFarmIDs);
            farmList.forEach(farm => {
                if (likeFarmIDs.includes(farm.FarmID.toString())) {
                    farm.Liked = true;
                } else {
                    farm.Liked = false;
                }
            });
        }
        else {
            farmList.forEach(farm => {farm.Liked = false;});
        }

        //불필요한 항목 삭제
        farmList.forEach((farm) => {
            delete farm.Owner;
            delete farm.LocationBig;
            delete farm.LocationMid;
            delete farm.LocationSmall;
            delete farm.Description;
            delete farm.createAt;
            delete farm.updateAt;
        })

        // console.log(farmList, "farmList")
        return response(resStatus_5000.FARM_LIST_AVAILABLE_FOR_RESERVATION, farmList);

    // } catch (err) {
    //     return errResponse(resStatus.DB_ERROR);
    // }
}

exports.deleteLike = withConnection(async (connection, likeFarms, farmID) => {
    const updateLike = await farmDao.updateFarmLikes(connection, [likeFarms, farmID]);
    return updateLike;
});

exports.deletePhoto = withConnection(async (connection, key) => {
    const deleteFarmPicture = await farmDao.deletePhoto(connection, key);
    return deleteFarmPicture;
});

/* farmDate */
exports.addFarmDate = withConnection(async (connection, farmID, unavailableStartDate, unavailableEndDate) => {

    const farmInfo = await FarmProvider.retrieveFarmInfo(farmID); //존재여부확인
    if (farmInfo.length <= 0) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    let FarmDateInfo = [farmID, unavailableStartDate, unavailableEndDate];

    const isSameFarmDate = await FarmProvider.isSameFarmDate(FarmDateInfo); //중복체크
    if (isSameFarmDate) return errResponse(resStatus_5000.FARM_DATE_DUPLICATED_EXISTS);

    const newFarmDate = await farmDao.insertFarmDate(connection, FarmDateInfo);

    // console.log(newFarmDate, "newFarmDate");

    return response(resStatus_5000.FARM_UNAVAILABLE_DATE_SUCCESS, { "farmDateID": newFarmDate });
});

/* farmDate */
exports.deleteFarmDate = withConnection(async (connection, farmDateId) => {

    const farmDate = await FarmProvider.farmDateByFarmDateId(farmDateId); //존재여부확인
    if (!farmDate) return errResponse(resStatus_5000.FARM_DATE_NOT_EXIST);

    // console.log(farmDate, "farmDate");

    const deletedFarmDate = await farmDao.deleteFarmDate(connection, farmDateId);

    return response(resStatus_5000.FARM_UNAVAILABLE_DATE_DELETE, { "farmDateID": farmDateId });
});

/* farmDate */
exports.getFarmDate = async (farmId) => {

    const farmInfo = await FarmProvider.retrieveFarmInfo(farmId); //존재여부확인
    if (farmInfo.length <= 0) return errResponse(resStatus_5000.FARM_FARMID_NOT_EXIST);

    const farmDate = await FarmProvider.getFarmDateByFarmId(farmId);

    return response(resStatus_5000.FARM_UNAVAILABLE_DATE, farmDate);
};