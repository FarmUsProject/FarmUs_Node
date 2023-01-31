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