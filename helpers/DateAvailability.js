const resStatus_5000 = require('../config/resStatus_5000');
import * as moment from 'moment';

/**
 * 
 * [newStart와 newEnd가 타깃기간 내에 존재하는지 파악]
 * @param {Date} tartgetStart 타깃 기간 시작점
 * @param {Date} targetEnd 타깃 기간 마지막점
 * @param {Date} newStart 새로운 기간 시작점
 * @param {Date} newEnd 새로운 기간 마지막점
 * @returns resStatus_5000 (available : false)
 */
export async function dateAvailabilityCheck (tartgetStart, targetEnd, newStart, newEnd) {
    //targetStart - newStart - newEnd - targetwEnd : date 순서

    if(tartgetStart.getTime() > newStart.getTime() && targetEnd.getTime() < newEnd.getTime())
        return resStatus_5000.RESERVE_DATE_OFF_PERIOD_OF_FARM;

    if(newStart.getTime() > newEnd.getTime())
        return resStatus_5000.DATE_END_FASTER_THAN_FIRST;

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

/**
 * (다음의 형식에 부합해야 함)
 * 2000-01-01
 * 2000-01-1 00:00:00
 */
export async function isValidDatetype (date) {

    let YMD_format = moment(date, "YYYY-MM-DD").isValid();
    let YMDhms_format = moment(date, "YYY-MM-DD  hh:mm:ss").isValid();

    if(!YMD_format || !YMDhms_format) 
        return false;
    else true;
}