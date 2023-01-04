const JWT = require('jsonwebtoken');
require('dotenv').config();

const PRIVATE_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES;


const generateToken = (dataObj) => {
    const token = JWT.sign(dataObj, PRIVATE_KEY, {
        expiresIn: EXPIRES_IN
    });
    return token;
}

const decodeToken = (token) => {
    const decoded = JWT.verify(token, PRIVATE_KEY);
    if ((decoded.iat + decoded.exp)* 1000 < Date.now()) {
        throw new Error('Token has been expired');
    }
    return decoded;
}

module.exports = {
    generateToken,
    decodeToken
}