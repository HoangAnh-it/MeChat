const { StatusCodes } = require('http-status-codes');
const { decodeToken } = require('../utils/Jwt');

module.exports = function authenticate(req, res, next) {
    const accessToken = req.headers.authorization || req.cookies['access_token'];
    if (!accessToken) {
        return res.status(StatusCodes.FORBIDDEN).json({message: 'No credentials sent!'})
    }

    if (!accessToken.startsWith('Bearer ')) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Authorization Token is not Bearer!' })
    }

    const token = accessToken.split(' ')[1];

    try {
        const { id } = decodeToken(token);
        req.auth = {
            user: { id },
            accessToken
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    }

}