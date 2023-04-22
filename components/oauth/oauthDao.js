async function insertOauthUser(connection, newOauthUserInfo) {
    //newOauthUserInfo [email, phoneNumber, name, role, createAt, updateAt]
    const insertOauthUserQuery = `
    INSERT INTO User(email, phoneNumber, name, role, createAt, updateAt)
    VALUES(?, ?, ?, ?, ?, ?);
    `;

    const insertOauthUserResult = await connection.query(insertOauthUserQuery, newOauthUserInfo);

    return insertOauthUserResult;
}

module.exports = {
    insertOauthUser,
}