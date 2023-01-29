async function selectUserbyEmail(connection, email) {
    const selectUserbyEmailQuery = `
    SELECT *
    FROM User
    WHERE email = ?;
    `;
    const userInfo = await connection.query(selectUserbyEmailQuery, email);

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

module.exports = {
    selectUserbyEmail,
    insertUser,
}