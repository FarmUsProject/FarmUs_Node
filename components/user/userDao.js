async function selectUserbyEmail(connection, email) {
    const selectUserbyEmailQuery = `
    SELECT *
    FROM User
    WHERE email = ?;
    `;
    const userInfo = await connection.query(selectUserbyEmailQuery, email);

    return userInfo;
}

async function selectUserbyPhoneNumber(connection, phoneNumber) {
    const selectUserbyPhoneNumberQuery = `
    SELECT *
    FROM User
    WHERE phoneNumber = ?;
    `;
    const userInfo = await connection.query(selectUserbyPhoneNumberQuery, phoneNumber);

    return userInfo;
}

async function insertUser(connection, newUserInfo) {
    //newUserInfo [email, hashedPassword, salt, phoneNumber, nickName, name, role, createAt, updateAt]
    const insertUserQuery = `
    INSERT INTO User(email, password, salt, phoneNumber, nickName, name, role, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertUserResult = await connection.query(insertUserQuery, newUserInfo);

    return insertUserResult;
}

async function selectStarbyEmail(connection, email) {
    const selectStarbyEmailQuery = `
    SELECT LikeFarmIDs
    FROM User
    WHERE email = ?;
    `;
    const starList = await connection.query(selectStarbyEmailQuery, email);

    return starList;
}

async function updateUserStar(connection, starRequest) {
    //starRequest [email, newStarList]
    const updateUserStarQuery = `
    UPDATE User
    SET LikeFarmIDs = ?
    WHERE Email = ?;
    `;
    const updateUserStarResult = await connection.query(updateUserStarQuery, starRequest);

    return updateUserStarResult;
}

async function updateUserBirth(connection, birthRequest) {
    //birthRequest = [email, birth, updateAt]
    const updateUserBirthQuery = `
    UPDATE User
    SET Birth = ?, updateAt = ?
    WHERE Email = ?;
    `
    const updateUserBirthResult = await connection.query(updateUserBirthQuery, birthRequest);

    return updateUserBirthResult;
}

module.exports = {
    selectUserbyEmail,
    selectUserbyPhoneNumber,
    insertUser,
    selectStarbyEmail,
    updateUserStar,
    updateUserBirth
}