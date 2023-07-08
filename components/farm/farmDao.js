//const { connection } = require("mongoose");

const { login } = require("../../helpers/validator");

exports.selectFarm = async (connection) => {
    const selectFarmListQuery = `
    SELECT *
    FROM Farm
    WHERE Status IN ('A');
    `;

    const [FarmRows] = await connection.query(selectFarmListQuery);
    return FarmRows;
}

exports.selectFarmDetail = async (connection, farmID) =>{
    const selectFarmDetailQuery = `
        SELECT FarmID, Name, Owner, SquaredMeters, Price, LocationBig, LocationMid, LocationSmall, Description, Views, Status
        FROM Farm
        WHERE FarmID = ?;
    `;

    const [FarmDetailRows] = await connection.query(selectFarmDetailQuery);
    return FarmDetailRows[0];
}

exports.selectUsedFarmDetail = async (connection, FarmIDArray) =>{
    const selectFarmDetailQuery = `
        SELECT Name, Owner, Picture_url, Price, Term, SquaredMeters, Location, Category, Tag, Status
        FROM Farm
        WHERE FarmID IN  ( $(FarmIDArray.join(","));
    `;

    const [FarmDetailRows] = await connection.query(selectFarmDetailQuery);
    return FarmDetailRows;
}

exports.selectUseFarmDetail = async (connection, FarmIDArray) =>{
    const selectFarmDetailQuery = `
        SELECT Name, Owner, Picture_url, Price, Term, SquaredMeters, Location, Category, Tag, Status
        FROM Farm
        WHERE FarmID IN  ( $(FarmIDArray.join(","));
    `;

    const [FarmDetailRows] = await connection.query(selectFarmDetailQuery);
    return FarmDetailRows;
}

exports.userToFarmer = async (connection, email) => {
    const  ChangeToFarmOwnerQuery = `
        UPDATE User
        SET Role = 'F'
        WHERE Email = ? and Status = 'A';
    `;

    const [ChangeToFarmOwnerResult]= await connection.query(ChangeToFarmOwnerQuery, email);
    return ChangeToFarmOwnerResult.changedRows;
}

exports.selectFarmbyFarmID = async(connection, farmID) =>{
    const selectFarmbyFarmIDQuery = `
    SELECT *
    FROM Farm
    WHERE FarmID = ?;
    `;
    const farmInfo = await connection.query(selectFarmbyFarmIDQuery, farmID);

    return farmInfo;
}

exports.insertFarm = async(connection, newFarmInfo) => {
    //newFarmInfo [newFarmID, name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall, description, category, tag, newFarmStatus, createAt, updateAt] : 16 fields
    const insertFarmQuery = `
    INSERT INTO Farm(FarmID, Name, Owner, startAt, endAt, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Description, Category, Tag, Status, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const farmInfo = await connection.query(insertFarmQuery, newFarmInfo);

    return farmInfo;
}

exports.selectFarmbyFarmInfo = async(connection, sameFarmInfo) =>{
    //newFarmInfo [newFarmID, name, owner, startDate, endDate, price, squaredMeters, locationBig, locationMid, locationSmall, description, category, tag, newFarmStatus, createAt, updateAt]
    const duplicatedInfo = sameFarmInfo.slice(1,10);
    const selectFarmbyFarmInfoQuery =`
    SELECT *
    FROM Farm
    WHERE NAME = ? AND Owner = ? AND startAT = ? AND endAt = ? AND Price = ? AND SquaredMeters = ? AND LocationBig = ? AND LocationMid = ? AND LocationSmall = ?
    `;
    const sameFarm = await connection.query(selectFarmbyFarmInfoQuery, duplicatedInfo);

    return sameFarm;
}

exports.searchFarm = async(connection, keyword) => {
    const searchFarmQuery = `
    SELECT f.FarmID,
    f.Name,
    f.Price,
    f.SquaredMeters,
    f.LocationBig,
    f.LocationMid,
    f.LocationSmall,
    f.Likes,
    fp.Picture_url
  FROM Farm f
  LEFT JOIN (
    SELECT FarmID, Picture_url
    FROM FarmPictures
    GROUP BY FarmID
  ) fp ON f.FarmID = fp.FarmID
  WHERE f.Name LIKE ? OR f.LocationBig LIKE ? OR f.LocationMid LIKE ? OR f.LocationSmall LIKE ?;`;

    console.log(keyword);
    const [farmRow] = await connection.query(searchFarmQuery,[keyword,keyword,keyword,keyword])
    console.log(farmRow);
    return farmRow
}

exports.withdrawalUserFarm = async(connection, email) => {
    const selectFarmbyEmailQuery = `
    UPDATE Farm
    SET Status = 'D'
    WHERE Owner = ?;`

    const [selectStarbyEmail] = await connection.query(selectFarmbyEmailQuery,email)
    console.log(selectStarbyEmail);
    return selectStarbyEmail
}

exports.eidtMyFarm = async(connection, farmID, farmInfo) =>{
    const update =  Object.values(farmInfo)
    update.push(farmID)
    const eidtFarmQuery = `
    UPDATE Farm
    SET Name = ?, Description=?, LocationBig=?, LocationMid=?, LocationSmall=?, SquaredMeters=?, Price=?
    WHERE FarmID = ?;
    `
    const [res] = await connection.query(eidtFarmQuery, update)
    console.log("res",res);
    return res

}

exports.editFarmPicture = async(connection, farmID, img, key) => {
    const saveFarmPicturesQuery= `
    INSERT INTO FarmPictures(FarmID, Picture_url, Picture_key)
    VALUES (?, ?, ?);
    `
    const postFarmPicture = await connection.query(saveFarmPicturesQuery, [farmID, img, key])
    return postFarmPicture[0]
}

exports.updateFarmStar = async(connection, updatedStarNumberInfo) => {
    // updatedStarNumberInfo = [StarNumber, updateAt, farmID]
    const updateFarmStarQuery = `
    UPDATE Farm
    SET Star = ?, updateAt = ?
    WHERE FarmID = ?
    `

    const updatedStarNumber = await connection.query(updateFarmStarQuery, updatedStarNumberInfo);
    return updatedStarNumber;
}

exports.selectFarmPicturesUrlbyFarmID = async(connection, farmID) =>{
    const selectFarmPicturesUrlbyFarmIDQuery =`
    SELECT Picture_url, Picture_key
    FROM FarmPictures
    WHERE FarmID = ?;
    `;
    const pictureUrlByFarmID = await connection.query(selectFarmPicturesUrlbyFarmIDQuery, farmID);

    return pictureUrlByFarmID;
}

exports.selectFarmPicturesUrlKey = async(connection) =>{
    const selectFarmPicturesUrlQuery =`
    SELECT FarmID, Picture_url, Picture_key
    FROM FarmPictures;
    `;
    const pictureUrls = await connection.query(selectFarmPicturesUrlQuery);

    return pictureUrls;
}