exports.selectFarmPostings = async (connection, farmid) =>{
    const selectFarmPostingsQuery = `
        SELECT UserName, Comment, Star
        FROM Post
        WHERE FarmID = ?;
    `;

    const [FarmPostRows] = await connection.query(selectFarmPostingsQuery);
    return FarmPostRows;
}

exports.insertPost = async (connection, params) => {
    const insertingPostsQuery = `
       INSERT INTO POST (Username, Comment, Star, FarmID)
        Values (?,?,?,?);
    `;

    const insertFarmPost = await connection.query(
        insertingPostsQuery,
        params
    );

    return insertFarmPost;
}