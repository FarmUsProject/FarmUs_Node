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


async function selectReservedClients(connection, farmID) {
    const selectReservedClientsQuery = `
    SELECT *
    FROM Reservation
    WHERE farmID = ?;
    `;

    const reservedClients = await connection.query(selectReservedClientsQuery, farmID);

    return reservedClients;
}


async function selectReservedFarms(connection, userEmail) {
    const selectReservedFarmsQuery = `
    SELECT *
    FROM Reservation
    WHERE userEmail = ?;
    `;

    const reservedFarms = await connection.query(selectReservedFarmsQuery, userEmail);

    return reservedFarms;
}

module.exports = {
    insertReservation,
    selectReservedClients,
    selectReservedFarms,
}