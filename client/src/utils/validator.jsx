const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneNumberPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

export const isEmail = (email) => {
    return emailPattern.test(email)
}

export const isPhoneNumber = (phoneNumber) => {
    return phoneNumberPattern.test(phoneNumber)
}

export const isEmptyString = (...strings) => {
    for (const string of strings) {
        if(!string) return true
    }
    return false;
}

export const trimStrings = (string) => {
    return string.trim();
}

export const trimObject = (obj) => {
    Object.keys(obj).forEach(key => obj[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key]);
    return obj
}

export const isFalsy = (input) => {
    if (input === undefined || input === null)
        return true
    if (typeof input === 'string')
        return isStringFalsy(input)
    else if (typeof input === 'number')
        return isNumberFalsy(input)
    else if (typeof input === 'boolean')
        return isBooleanFalsy(input)
    else if (typeof input === 'number')
        return isNumberFalsy(input)
    else if (typeof input === 'object')
        return isObjectFalsy(input)
    else return false
}

const isStringFalsy = (str) => {
    switch (str) {
        case 'undefined':
        case 'null':
        case '':
            return true
                
        default:
            return false
    }
}

const isNumberFalsy = (num) => {
    switch (num) {
        case 0:
        case Number.isNaN(num):
            return true
    
        default:
            return false;
    }
}

const isObjectFalsy = (obj) => {
    if (Object.keys(obj).length === 0 || obj === null || obj === undefined)
        return true
    return false
}

const isBooleanFalsy = (boolean) => {
    return !boolean;
}