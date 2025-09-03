"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDate = normalizeDate;
exports.toDate = toDate;
exports.isValidDate = isValidDate;
exports.isFutureDate = isFutureDate;
exports.isEndDateAfterStartDate = isEndDateAfterStartDate;
function normalizeDate(date) {
    if (!date)
        return undefined;
    try {
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return undefined;
            }
            return date;
        }
        else if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        }
    }
    catch (error) {
        return undefined;
    }
    return undefined;
}
function toDate(date) {
    if (!date)
        return undefined;
    try {
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return undefined;
            }
            return parsedDate;
        }
        else if (date instanceof Date) {
            return date;
        }
    }
    catch (error) {
        return undefined;
    }
    return undefined;
}
function isValidDate(date) {
    if (!date)
        return false;
    try {
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }
        else if (date instanceof Date) {
            return !isNaN(date.getTime());
        }
    }
    catch (error) {
        return false;
    }
    return false;
}
function isFutureDate(date) {
    const normalizedDate = toDate(date);
    if (!normalizedDate)
        return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return normalizedDate > today;
}
function isEndDateAfterStartDate(startDate, endDate) {
    if (!startDate || !endDate)
        return true;
    const start = toDate(startDate);
    const end = toDate(endDate);
    if (!start || !end)
        return false;
    return end >= start;
}
//# sourceMappingURL=date.utils.js.map