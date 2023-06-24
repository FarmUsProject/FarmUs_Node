//const { connection } = require("mongoose");

exports.selectionFarm = async (connection) => {
    const selectFarmListQuery = `
        SELECT FarmID, Name, Owner, Picture_url, Price, Term, SquaredMeters, Location, Category, Tag
        FROM Farm
        WHERE Status = 1;
    `;

    const [FarmRows] = await connection.query(selectFarmListQuery);
    return FarmRows;
}

exports.selectFarmDetail = async (connection, farmIdx) =>{
    const selectFarmDetailQuery = `
        SELECT Name, Owner, Picture_url, Price, Term, SquaredMeters, Location, Category, Tag, Status
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

exports.ChangeUser_Status = async (connection, userid) => {
    const  ChangeToFarmOwnerQuery = `
        UPDATE User
        SET Role = 'F'
        WHERE Email = ?;
    `;

    const ChangeToFarmOwnerResult = await connection.query(ChangeToFarmOwnerQuery, userid);
    return ChangeToFarmOwnerResult;
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
    //newFarmInfo [newFarmID, name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus, createAt, updateAt]
    const insertFarmQuery = `
    INSERT INTO Farm(FarmID, Name, Owner, startAt, endAt, Price, SquaredMeters, Location, Description, Picture_url, Category, Tag, Status, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const farmInfo = await connection.query(insertFarmQuery, newFarmInfo);

    return farmInfo;
}

exports.selectFarmbyFarmInfo = async(connection, sameFarmInfo) =>{
    //newFarmInfo [newFarmID, name, owner, startDate, endDate, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus, createAt, updateAt]
    const duplicatedInfo = sameFarmInfo.slice(1,8);
    const selectFarmbyFarmInfoQuery =`
    SELECT *
    FROM Farm
    WHERE NAME = ? AND Owner = ? AND startAT = ? AND endAt = ? AND Price = ? AND SquaredMeters = ? AND Location = ?
    `;
    const sameFarm = await connection.query(selectFarmbyFarmInfoQuery, duplicatedInfo);

    return sameFarm;
}

exports.searchFarm = async(connection, keyword) => {
    const searchFarmQuery = `
    SELECT FarmID,
			Name,
			Picture_url,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes
    FROM Farm
    WHERE Name LIKE ? OR LocationBig LIKE ? OR LocationMid LIKE ? OR LocationSmall LIKE ?;`
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

exports.editFarmPicture = async(connection, farmID, farmName, img, key) => {
    const saveFarmPicturesQuery= `
    INSERT INTO FarmPictures(FarmID, Name, Picture_url, Picture_key)
    VALUES (?, ?, ?, ?);
    `
    const postFarmPicture = await connection.query(saveFarmPicturesQuery, [farmID, farmName, img, key])
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
