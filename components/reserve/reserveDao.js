async function insertReservation(connection, newReservationInfo) {
    //newReservationInfo [userEmail, farmID, ownerEmail, term]
    const insertReservationQuery = `
    INSERT INTO Reservation(UserEmail, FarmID, OwnerEmail, Term, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertUserResult = await connection.query(insertReservationQuery, newReservationInfo);

    return insertUserResult;
}

async function selectReservedClients(connection, farmID) {
    const selectReservedClientsQuery = `
    SELECT *
    FROM Reservation
    WHERE FarmID = ?;
    `;

    const reservedClients = await connection.query(selectReservedClientsQuery, farmID);

    return reservedClients;
}

async function selectReservedFarms(connection, userEmail) {
    const selectReservedFarmsQuery = `
    SELECT *
    FROM Reservation
    WHERE UserEmail = ?;
    `;

    const reservedFarms = await connection.query(selectReservedFarmsQuery, userEmail);

    return reservedFarms;
}


module.exports = {
    insertReservation,
    selectReservedClients,
    selectReservedFarms,
}