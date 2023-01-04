const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneNumberPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

const isEmail = (email) => {
    return emailPattern.test(email)
}

const isPhoneNumber = (phoneNumber) => {
    return phoneNumberPattern.test(phoneNumber)
}

const isEmptyString = (...strings) => {
    for (const string of strings) {
        if(!string) return true
    }
    return false;
}

module.exports = {
    isEmail, isPhoneNumber, isEmptyString
}