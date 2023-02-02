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

async function updateNickName(connection, email, nickname) {
    const updateUserQuery = `
    UPDATE User
    SET NickName = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [nickname, email]);
    return updateUserRow[0];
}

async function updateName(connection, email, name) {
    const updateUserQuery = `
    UPDATE User
    SET Name = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [name, email]);
    return updateUserRow[0];
}

async function updatePhoneNum(connection, email, phoneNumber) {
    const updateUserQuery = `
    UPDATE User
    SET PhoneNumber = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [phoneNumber, email]);
    return updateUserRow[0];
}

async function withdrawalUser(connection, email){
    const withdrawalUserQuery = `
    UPDATE User
    SET Status = 'D'
    WHERE Email = ?;`

    const withdrawalUserRow = await connection.query(withdrawalUserQuery, email)
    return withdrawalUserRow[0]
}

async function eidtProfileImg(connection, email, img){
    const eidtProfileImgQuery = `
    UPDATE User
    SET Picture_url = ?
    WHERE Email = ?;`

    const updateUserRow = await connection.query(eidtProfileImgQuery, [img,email])
    return updateUserRow[0]
}

module.exports = {
    selectUserEmail,
    selectUser,
    updatePassword,
    updateNickName,
    updateName,
    updatePhoneNum,
    withdrawalUser,
    eidtProfileImg
}