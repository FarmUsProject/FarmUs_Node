async function selectFarmbyFarmID(connection, farmID) {
    const selectFarmbyFarmIDQuery = `
    SELECT *
    FROM Farm
    WHERE farmID = ?;
    `;
    const farmInfo = await connection.query(selectFarmbyFarmIDQuery, farmID);

    return farmInfo;
}

async function insertFarm(connection, newFarmInfo) {
    //newFarmInfo [newFarmID, name, owner, picture_url, price, squaredMeters, location, description]
    const insertFarmQuery = `
    INSERT INTO Farm(newFarmID, name, owner, picture_url, price, squaredMeters, location, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const farmInfo = await connection.query(insertFarmQuery, newFarmInfo);

    return farmInfo;
}

module.exports = {
    selectFarmbyFarmID,
    insertFarm,
}