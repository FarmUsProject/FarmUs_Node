async function selectFarmbyFarmID(connection, farmID) {
    const selectFarmbyFarmIDQuery = `
    SELECT *
    FROM Farm
    WHERE FarmID = ?;
    `;
    const farmInfo = await connection.query(selectFarmbyFarmIDQuery, farmID);

    return farmInfo;
}

async function insertFarm(connection, newFarmInfo) {
    //newFarmInfo [newFarmID, name, owner, term, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus, createAt, updateAt]
    const insertFarmQuery = `
    INSERT INTO Farm(FarmID, Name, Owner, Term, Price, SquaredMeters, Location, Description, Picture_url, Category, Tag, Status, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const farmInfo = await connection.query(insertFarmQuery, newFarmInfo);
    
    return farmInfo;
}

async function selectFarmbyFarmInfo(connection, sameFarmInfo) {
    //newFarmInfo [newFarmID, name, owner, term, price, squaredMeters, location, description, picture_url, category, tag, newFarmStatus]
    const duplicatedInfo = sameFarmInfo.slice(1,7);
    const selectFarmbyFarmInfoQuery =`
    SELECT *
    FROM Farm
    WHERE NAME = ? AND Owner = ? AND Term = ? AND Price = ? AND SquaredMeters = ? AND Location = ?
    `;
    const sameFarm = await connection.query(selectFarmbyFarmInfoQuery, duplicatedInfo);

    return sameFarm;
}

module.exports = {
    selectFarmbyFarmID,
    insertFarm,
    selectFarmbyFarmInfo,
}