async function insertReservation(connection, newReservationInfo) {
    //newReservationInfo [ReserveID, FarmID, UserEmail, OwnerEmail, Status, startAt, endAt, createAt, updateAt]
    const insertReservationQuery = `
    INSERT INTO Reservation(ReserveID, FarmID, UserEmail, OwnerEmail, Status, startAt, endAt, createAt, updateAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
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

async function editReservationStatus(connection, updatedStatusInfo) {
    //updatedStatuasInfo = [status, updateAt, reserveID]
    const updatedStatusQuery = `
    UPDATE Reservation
    SET Status = ?, updateAt = ?
    WHERE reserveID = ?;
    `;

    const updatedStatusResult = await connection.query(updatedStatusQuery, updatedStatusInfo);

    return updatedStatusResult;
}

async function currentUseList(connection, email) {
   const currentUseListQuery = `
    SELECT R.ReserveID, R.FarmID, R.UserEmail, R.OwnerEmail, R.startAt, R.endAt, F.Name, FP.Picture_url
    FROM Reservation R
    LEFT JOIN Farm F ON R.FarmID = F.FarmID
    LEFT JOIN FarmPictures FP ON R.FarmID = FP.FarmID
    WHERE DATE(NOW()) >= DATE(R.startAt)
        AND (DATE(NOW()) <= DATE(R.endAt) OR R.endAt IS NULL)
        AND R.Status = 'A'
        AND R.UserEmail = ?
    ORDER BY FP.createAt DESC
    LIMIT 1;
`;

   const currentUseListResult = await connection.query(currentUseListQuery, email);

   return currentUseListResult;
}

async function pastUseList(connection, email) {
    const pastUseListQuery = `
    SELECT R.ReserveID, R.FarmID, R.UserEmail, R.OwnerEmail, R.startAt, R.endAt, F.Name, FP.Picture_url
    FROM Reservation R
    LEFT JOIN Farm F ON R.FarmID = F.FARMID
    LEFT JOIN FarmPictures FP ON R.FarmID = FP.FarmID
    WHERE DATE(NOW()) > DATE(R.startAt)
        AND DATE(NOW()) > DATE(R.endAt)
        AND R.Status = 'A'
        AND R.UserEmail = ?
    ORDER BY FP.createAt DESC
    LIMIT 1;
    `;

    const pastUseListResult = await connection.query(pastUseListQuery, email);

    return pastUseListResult;
 }

 async function reservedPeriods(connection, farmID) {
    const reservedPeriodsQuery = `
    SELECT startAt, endAt
    FROM Reservation
    WHERE DATE(NOW()) <= DATE(endAt)
      AND Status = 'A'
      AND FarmID = ?;
    `;

    const reservedPeriodsResult = await connection.query(reservedPeriodsQuery, farmID);

    return reservedPeriodsResult;
 }

 async function deleteReservation(connection, email){
    const deleteReservationQuery = `DELETE FROM Reservation WHERE UserEmail = ?;`;
    const deleteReservationResult = await connection.query(deleteReservationQuery, email);
    return deleteReservationResult;
 }

module.exports = {
    insertReservation,
    selectReservedClients,
    selectReservedFarms,
    selectReservedItem,
    cancelReservation,
    editReservationStatus,
    currentUseList,
    pastUseList,
    reservedPeriods,
    deleteReservation,
}