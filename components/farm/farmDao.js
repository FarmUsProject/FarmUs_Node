
const searchFarm = async(connection, keyword) => {
    const searchFarmQuery = `
    SELECT FarmName, Location, Price, SquaredMeters, Picture_url, Views, Star, Likes, createAt
    FROM farm
    WHERE FarmName LIKE ? OR Location LIKE ?;`
    console.log(keyword);
    const [farmRow] = await connection.query(searchFarmQuery,[keyword,keyword])
    console.log(farmRow);
    return farmRow
}

module.exports = {
    searchFarm
}