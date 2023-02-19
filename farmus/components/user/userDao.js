exports.SelectionUsedFarmArray = async (connection, userid) => {
    const UsedFarmArrayQuery = `
    Select BefoUse_Farm
    From User
    WHERE userid = ?;
    `;

    return UsedFarmArrayQuery;
}

exports.SelectionUseFarmArray = async (connection, userid) => {
    const UseFarmArrayQuery = `
    Select CurUse_Farm
    From User
    WHERE userid = ?;
    `;

    return UseFarmArrayQuery;
}