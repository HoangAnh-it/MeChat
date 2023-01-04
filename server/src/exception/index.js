const handleException = (error) => {
    console.log(error)
    return {
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message
    }
}

const { StatusCodes } = require('http-status-codes');
const CustomError = require('./CustomException');

module.exports = {
    handleException,
    NotFoundException: (message) => new CustomError(message, StatusCodes.NOT_FOUND),
    UnAuthorizedException: (message) => new CustomError(message, StatusCodes.UNAUTHORIZED),
    InternalServerException: (message) => new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR),
    ConflictException: (message) => new CustomError(message, StatusCodes.CONFLICT),
    BadRequestException: (message) => new CustomError(message, StatusCodes.BAD_REQUEST),
}