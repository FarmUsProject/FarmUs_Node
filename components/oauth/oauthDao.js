async function insertOauthUser(connection, newOauthUserInfo) {
    //newOauthUserInfo [email, phoneNumber, name, picture_url, role, socialLoginStatus, createAt, updateAt]

    const insertOauthUserQuery = `
    INSERT INTO User(Email, PhoneNumber, Name, Picture_url, Role, Status, createAt, updateAt)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertOauthUserResult = await connection.query(insertOauthUserQuery, newOauthUserInfo);

    return insertOauthUserResult;
}

module.exports = {
    insertOauthUser,
}