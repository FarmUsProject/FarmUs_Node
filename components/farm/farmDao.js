//const { connection } = require("mongoose");

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
    //newFarmInfo [newFarmID, name, owner, price, squaredMeters, locationBig, locationMid, locationSmall, description, newFarmStatus, createAt, updateAt] : 12 fields
    const insertFarmQuery = `
    INSERT INTO Farm(FarmID, Name, Owner, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Description, Status, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const farmInfo = await connection.query(insertFarmQuery, newFarmInfo);

    return farmInfo;
}

exports.selectFarmbyFarmInfo = async(connection, sameFarmInfo) =>{
    // sameFarmInfo [name, owner, price, squaredMeters, locationBig, locationMid, locationSmall];

    const selectFarmbyFarmInfoQuery =`
    SELECT *
    FROM Farm
    WHERE NAME = ? AND Owner = ? AND Price = ? AND SquaredMeters = ? AND LocationBig = ? AND LocationMid = ? AND LocationSmall = ?
    `;
    const sameFarm = await connection.query(selectFarmbyFarmInfoQuery, sameFarmInfo);

    return sameFarm;
}

exports.searchFarm = async(connection, keyword) => {

    const searchFarmQuery = `
    SELECT f.FarmID,
			Name,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes,
            MIN(Picture_url) as Picture_url
    FROM Farm f
    LEFT JOIN FarmPictures fp ON f.FarmID = fp.FarmID
    WHERE f.Name LIKE ? OR f.LocationBig LIKE ? OR f.LocationMid LIKE ? OR f.LocationSmall LIKE ?
    GROUP BY f.FarmID, Name, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Likes;
`;

    console.log(keyword);
    const [farmRow] = await connection.query(searchFarmQuery,[keyword,keyword,keyword,keyword])
    console.log(farmRow);
    return farmRow.length > 0 ? farmRow : [];
}

exports.filtering = async(connection, locationBig, locationMid) => {
    const filteringQuery = `
     SELECT f.FarmID,
			Name,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes,
            MIN(Picture_url) as Picture_url
    FROM Farm f
    LEFT JOIN FarmPictures fp ON f.FarmID = fp.FarmID
    WHERE f.LocationBig LIKE ? AND f.LocationMid LIKE ?
    GROUP BY f.FarmID, Name, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Likes;
    `
    const [farmRow] = await connection.query(filteringQuery,[locationBig,locationMid])
    return farmRow.length > 0 ? farmRow : [];
}

exports.filteringBig = async(connection, locationBig) => {
    const filteringQuery = `
     SELECT f.FarmID,
			Name,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes,
            MIN(Picture_url) as Picture_url
    FROM Farm f
    LEFT JOIN FarmPictures fp ON f.FarmID = fp.FarmID
    WHERE f.LocationBig LIKE ?
    GROUP BY f.FarmID, Name, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Likes;
    `
    const [farmRow] = await connection.query(filteringQuery,locationBig)
    return farmRow.length > 0 ? farmRow : [];
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

exports.deletePhoto = async(connection, key) => {
    const deleteFarmPicture = `
    DELETE FROM FarmPictures
    WHERE Picture_key = ?;
    `
    const res = await connection.query(deleteFarmPicture,key)
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

exports.updateFarmLikes = async(connection, updatedStarNumberInfo) => {
    // updatedStarNumberInfo = [StarNumber, updateAt, farmID]
    console.log(updatedStarNumberInfo);
    const updateFarmStarQuery = `
    UPDATE Farm
    SET Likes = ?
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

exports.getOwnerbyFarmID = async(connection,farmID) =>{
    const getOwnerbyFarmIDQuery = `
    SELECT PhoneNumber
    FROM User
    WHERE Email = (
        SELECT Owner
        FROM Farm
        WHERE FarmID = ?
    );
    `

    const [phoneNumber] = await connection.query(getOwnerbyFarmIDQuery, farmID)
    return phoneNumber[0];
}

exports.getFarmsbyFarmIDs = async(connection, farmIds) =>{
    const getFarmsbyFarmIDsQuery = `
    SELECT f.FarmID,
			Name,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes,
            MIN(Picture_url) as Picture_url
    FROM Farm f
    LEFT JOIN FarmPictures fp ON f.FarmID = fp.FarmID
    WHERE f.FarmID IN (?)
    GROUP BY f.FarmID, Name, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Likes;
    `

    const [farms] = await connection.query(getFarmsbyFarmIDsQuery, [farmIds])
    console.log(farms);
    return farms;
}

exports.getFarmsbyOwner = async(connection, owner) =>{
    const getFarmsbyOwnerQuery = `
    SELECT f.FarmID,
			Name,
			Price,
			SquaredMeters,
			LocationBig,
			LocationMid,
			LocationSmall,
			Likes,
            MIN(Picture_url) as Picture_url
    FROM Farm f
    LEFT JOIN FarmPictures fp ON f.FarmID = fp.FarmID
    WHERE f.Owner = ?
    GROUP BY f.FarmID, Name, Price, SquaredMeters, LocationBig, LocationMid, LocationSmall, Likes;`

    const [farms] = await connection.query(getFarmsbyOwnerQuery, owner)
    return farms;
}