async function insertReservation(connection, newReservationInfo) {
    //newReservationInfo [ReserveID, FarmID, UserEmail, OwnerEmail, startAt, endAt, createAt, updateAt]
    const insertReservationQuery = `
    INSERT INTO Reservation(ReserveID, FarmID, UserEmail, OwnerEmail, startAt, endAt, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
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

async function selectReservedItem(connection, reserveID) {
    const selectReservedItemQuery = `
    SELECT *
    FROM Reservation
    WHERE ReserveID = ?;
    `;

    const reservedFarms = await connection.query(selectReservedItemQuery, reserveID);

    return reservedFarms;
}

async function cancelReservation(connection , reserveID) {
    const cancelReservationQuery = `
    DELETE
    FROM Reservation
    WHERE ReserveID = ?;
    `;

    const canceledReservation = await connection.query(cancelReservationQuery, reserveID);

    return canceledReservation;
}


module.exports = {
    insertReservation,
    selectReservedClients,
    selectReservedFarms,
    selectReservedItem,
    cancelReservation
}