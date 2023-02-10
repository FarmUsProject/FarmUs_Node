/**
 * 
 * [newStart와 newEnd가 타깃기간 내에 존재하는지 파악]
 * @param {Date} tartgetStart 타깃 기간 시작점
 * @param {Date} targetEnd 타깃 기간 마지막점
 * @param {Date} newStart 새로운 기간 시작점
 * @param {Date} newEnd 새로운 기간 마지막점
 * @returns resStatus_5000 (available : false)
 */
const resStatus_5000 = require('../config/resStatus_5000');

export async function dateAvailabilityCheck (tartgetStart, targetEnd, newStart, newEnd) {
    //targetStart - newStart - newEnd - targetwEnd : date 순서

    if(tartgetStart.getTime() > newStart.getTime() && targetEnd.getTime() < newEnd.getTime())
        return resStatus_5000.RESERVE_DATE_OFF_PERIOD_OF_FARM;

    if(newStart.getTime() > newEnd.getTime())
        return resStatus_5000.DATE_WEIRD;


    return false;
}

export async function reserveAvailabilityCheck (reservedStart, reservedEnd, newStart, newEnd) {
    //newStart - reservedStart - newEnd - reservedEnd : unavailable
    //newStart - reservedStart - reservedEnd - newEnd : unavailable
    //reservedStart - newStart - newEnd - reservedEnd : unavailable
    //reservedStart - newStart - reservedEnd - newEnd : unavailable
    //newStart - newEnd - reservedStart - reservedEnd : available
    //reservedStart - reservedEnd - newStart - newEnd : available

    if ( newEnd < reservedStart || reservedEnd < newStart)
        return false;

    return resStatus_5000.RESERVE_DATE_FULL;
}