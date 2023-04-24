const SelectionUsedFarmArray = async (connection, userid) => {
    const UsedFarmArrayQuery = `
    Select BefoUse_Farm
    From user
    WHERE userid = ?;
    `;

    return UsedFarmArrayQuery;
}

const SelectionUseFarmArray = async (connection, userid) => {
    const UseFarmArrayQuery = `
    Select CurUse_Farm
    From user
    WHERE userid = ?;
    `;

    return UseFarmArrayQuery;
}

async function selectUserbyEmail(connection, email) {
    const selectUserbyEmailQuery = `
    SELECT *
    FROM user
    WHERE Email = ?;
    `;
    const userInfo = await connection.query(selectUserbyEmailQuery, email);

    return userInfo;
}

async function selectUserbyPhoneNumber(connection, phoneNumber) {
    const selectUserbyPhoneNumberQuery = `
    SELECT *
    FROM user
    WHERE PhoneNumber = ?;
    `;
    const userInfo = await connection.query(selectUserbyPhoneNumberQuery, phoneNumber);

    return userInfo;
}

async function insertUser(connection, newUserInfo) {
    const insertUserQuery = `
    INSERT INTO user(Email, Password, Salt, PhoneNumber, NickName, Name, Role, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertUserResult = await connection.query(insertUserQuery, newUserInfo);

    return insertUserResult;
}

async function selectStarbyEmail(connection, email) {
    const selectStarbyEmailQuery = `
    SELECT LikeFarmIDs
    FROM user
    WHERE Email = ?;
    `;
    const starList = await connection.query(selectStarbyEmailQuery, email);

    return starList;
}

async function updateUserStar(connection, starRequest) {
    //starRequest [email, newStarList, updateAt]
    const updateUserStarQuery = `
    UPDATE user
    SET LikeFarmIDs = ? updateAt = ?
    WHERE Email = ?;
    `;
    const updateUserStarResult = await connection.query(updateUserStarQuery, starRequest);

    return updateUserStarResult;
}

async function updateUserBirth(connection, birthRequest) {
    //birthRequest = [email, birth, updateAt]
    const updateUserBirthQuery = `
    UPDATE user
    SET Birth = ?, updateAt = ?
    WHERE Email = ?;
    `
    const updateUserBirthResult = await connection.query(updateUserBirthQuery, birthRequest);

    return updateUserBirthResult;
}


async function selectUser(connection, name, phoneNumber){
    const selectUserQuery = `
    SELECT Name, Email
    FROM user
    WHERE Name = ? AND PhoneNumber = ?;`;
    const [userRow] = await connection.query(selectUserQuery, [name, phoneNumber]);
    return userRow;
}

async function updatePassword(connection, email, pw) {
    const updateUserQuery = `
    UPDATE user
    SET Password = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [pw, email]);
    return updateUserRow[0];
}

async function updateNickName(connection, email, nickname) {
    const updateUserQuery = `
    UPDATE user
    SET NickName = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [nickname, email]);
    return updateUserRow[0];
}

async function updateName(connection, email, name) {
    const updateUserQuery = `
    UPDATE user
    SET Name = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [name, email]);

    return updateUserRow[0];
}

async function updatePhoneNum(connection, email, phoneNumber) {
    const updateUserQuery = `
    UPDATE user
    SET PhoneNumber = ?
    WHERE Email = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [phoneNumber, email]);
    return updateUserRow[0];
}

async function withdrawalUser(connection, email){
    const withdrawalUserQuery = `
    DELETE FROM user
    WHERE Email = ?;`

    const withdrawalUserRow = await connection.query(withdrawalUserQuery, email)
    return withdrawalUserRow[0]
}

async function eidtProfileImg(connection, email, img, key){
    const eidtProfileImgQuery = `
    UPDATE user
    SET Picture_url = ?, Picture_key = ?
    WHERE Email = ?;`
    console.log(img);
    console.log(key);
    const updateUserRow = await connection.query(eidtProfileImgQuery, [img,key, email])
    return updateUserRow[0]
}

module.exports = {
    selectUserbyEmail,
    selectUserbyPhoneNumber,
    insertUser,
    selectStarbyEmail,
    updateUserStar,
    updateUserBirth,
    selectUser,
    updatePassword,
    updateNickName,
    updateName,
    updatePhoneNum,
    withdrawalUser,
    eidtProfileImg,
    SelectionUsedFarmArray,
    SelectionUseFarmArray
}