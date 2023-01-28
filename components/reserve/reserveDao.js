const setDate = require('./../../helpers/setDate');

async function insertReservation(connection, newReservationInfo) {
    //newReservationInfo [userEmail, farmID, ownerEmail, term]
    const now = setDate.now()
    let newReservationInfo = newReservationInfo.push(now, now)
    
    const insertReservationQuery = `
    INSERT INTO Reservation(userEmail, farmID, ownerEmail, term, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertUserResult = await connection.query(insertReservationQuery, newReservationInfo);

    return insertUserResult;
}

module.exports = {
    insertReservation,
}