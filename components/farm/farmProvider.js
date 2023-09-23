const farmDao = require('./farmDao');
const withConnection = require('../../config/connection')

exports.retrieveFarmlist = withConnection(async (connection) => {
    const farmListResult = await farmDao.selectFarm(connection);
    return farmListResult;
});

exports.retrieveFarmInfo = withConnection(async (connection, farmID) => {
    const farmInfo = await farmDao.selectFarmbyFarmID(connection, farmID);
    return farmInfo[0];
});

exports.retrieveUsedFarmDetail = withConnection(async (connection, UsedArray) => {
    const UsedFarmDetail = await farmDao.selectUsedFarmDetail(connection, UsedArray);
    return UsedFarmDetail;
});

exports.retrieveUseFarmDetail = withConnection(async (connection, UsedArray) => {
    const UseFarmDetail = await farmDao.selectUseFarmDetail(connection, UsedArray);
    return UseFarmDetail;
});

exports.farmbyfarmID = withConnection(async (connection, farmID) => {
    const [farmInfo] = await farmDao.selectFarmbyFarmID(connection, farmID);
    return farmInfo[0];
});

exports.isSameFarm = withConnection(async (connection, farmInfo) => {
    const [sameFarm] = await farmDao.selectFarmbyFarmInfo(connection, farmInfo);
    if (sameFarm.length > 0) return true;
    else return false;
});

exports.getFarmArray = withConnection(async (connection, farmIDs) => {
    const FarmArray = await farmDao.getFarmsbyFarmIDs(connection, farmIDs);
    return FarmArray;
});

exports.farmFilter = withConnection(async (connection, locationBig, locationMid, likeFarms) => {
    let res = [];
    if (locationMid) {
        res = await farmDao.filtering(connection, locationBig, locationMid);
    } else {
        res = await farmDao.filteringBig(connection, locationBig);
    }

    const likeFarmsArray = likeFarms.split(', ');
    res.forEach((farm) => {
        if (likeFarmsArray.includes(String(farm.FarmID))) {
            farm.Liked = true;
        } else {
            farm.Liked = false;
        }
    });

    return res;
});

exports.retrieveFarms = withConnection(async (connection, keyword, likeFarms) => {
    const newKeyword = '%' + keyword + '%';
    const res = await farmDao.searchFarm(connection, newKeyword);
    const likeFarmsArray = likeFarms.split(', ');
    res.forEach((farm) => {
        if (likeFarmsArray.includes(String(farm.FarmID))) {
            farm.Liked = true;
        } else {
            farm.Liked = false;
        }
    });

    return res;
});

exports.farmPictureUrlbyFarmID = withConnection(async (connection, farmID) => {
    const farmPicturesInfo = await farmDao.selectFarmPicturesUrlbyFarmID(connection, farmID);
    return farmPicturesInfo[0];
});

exports.farmPictureUrl = withConnection(async (connection) => {
    const farmPicturesInfo = await farmDao.selectFarmPicturesUrlKey(connection);
    return farmPicturesInfo[0];
});

exports.getOwnerPhoneNumber = withConnection(async (connection, farmID) => {
    const Owner = await farmDao.getOwnerbyFarmID(connection, farmID);
    delete Owner.Email
    return Owner;
});

exports.getOwner = withConnection(async (connection, farmID) => {
    const Owner = await farmDao.getOwnerbyFarmID(connection, farmID);
    delete Owner.PhoneNumber
    return Owner;
});

exports.getOwnerFarms = withConnection(async (connection, email) => {
    const farms = await farmDao.getFarmsbyOwner(connection, email);
    return farms;
});

/* farmDate */
exports.isSameFarmDate = withConnection(async (connection, farmDateInfo) => {
    const [sameFarmDate] = await farmDao.selectFarmbyFarmDate(connection, farmDateInfo);
    if (sameFarmDate.length > 0) return true;
    else return false;
});