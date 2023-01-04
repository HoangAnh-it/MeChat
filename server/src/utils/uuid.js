const uuid = require('uuid');

const randomString = () => {
    return uuid.v4();
}

module.exports = {
    randomString
}