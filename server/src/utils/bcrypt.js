const bcrypt = require('bcryptjs');

const hash = (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedData = bcrypt.hashSync(data, salt);
    return hashedData;
}

const compare = (rawString, hashedString) => {
    return bcrypt.compareSync(rawString, hashedString);
}

module.exports = {
    hash,
    compare
}