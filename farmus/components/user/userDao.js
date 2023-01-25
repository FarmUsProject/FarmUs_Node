//sql문
async function selectUserEmail(connection, userEmail) {
    const selectUserEmailQuery = `
                   SELECT *
                   FROM User
                   WHERE Email = ?;
                   `;
    const [userRow] = await connection.query(selectUserEmailQuery, userEmail);
    return userRow;
}

async function selectUser(connection, name, phoneNumber){
    const selectUserQuery = `
    SELECT Name, Email
    FROM User
    WHERE Name = ? AND PhoneNumber = ?;`;
    const [userRow] = await connection.query(selectUserQuery, [name, phoneNumber]);
    return userRow;
}

async function updatePassword(connection, email, pw) {
    const updateUserQuery = `
    UPDATE User
    SET Password = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [pw, email]);
    return updateUserRow[0];
}

module.exports = {
    selectUserEmail,
    selectUser,
    updatePassword,
}