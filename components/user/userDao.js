async function selectUserbyEmail(connection, email) {
    const selectUserbyEmailQuery = `
    SELECT *
    FROM User
    WHERE email = ?;
    `;
    const userInfo = await connection.query(selectUserbyEmailQuery, email);

    return userInfo;
}


module.exports = {
    selectUserbyEmail,
}