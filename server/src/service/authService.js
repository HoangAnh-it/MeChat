const { db } = require('../entity');
const {Op} = require('sequelize')
const bcrypt = require('../utils/bcrypt');
const {NotFoundException, BadRequestException, UnAuthorizedException, ConflictException} = require('../exception')
const JWT = require('../utils/Jwt');
const { isEmail, isPhoneNumber, isEmptyString } = require('../utils/validator');
const userService = require('./userService');

const authService = {
    login: ({username, password}) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (isEmptyString(username, password)) {
                    return reject(BadRequestException("Username and Password must not be empty"));
                }
                if (!isEmail(username) && !isPhoneNumber(username)) {
                    return reject(BadRequestException("Username is invalid"));
                }


                const user = await userService.findByUsername(username);

                const isPasswordCorrect = bcrypt.compare(password, user.password);
                if (!isPasswordCorrect) {
                    return reject(UnAuthorizedException('Email, phone number or password is incorrect'))
                }
                const accessToken = JWT.generateToken({ id: user.id });
                resolve({
                    accessToken,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    signup: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, firstName, lastName, password, rePassword } = user;
                if (isEmptyString(username, firstName, lastName, password, rePassword)) {
                    return reject(BadRequestException("Information must not be empty"));
                }

                if (password !== rePassword) {
                    return reject(BadRequestException("Retype password does not match."));
                }

                if (!isEmail(username) && !isPhoneNumber(username)) {
                    return reject(BadRequestException("Username is invalid"));
                }

                const existingUser = await db.User.findOne({
                    where: {
                        [Op.or]: {
                            email: username,
                            phoneNumber: username
                        }
                    }
                })
                if (existingUser) {
                    return reject(ConflictException('Username is already in use'))
                }

                const newUser = db.User.create({
                    email: isEmail(username) ? username : null,
                    phoneNumber: isPhoneNumber(username) ? username : null,
                    firstName,
                    lastName,
                    password
                });
                if (!newUser) {
                    return reject(BadRequestException("Cannot create new user."));
                }
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    authenticate: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await userService.findById(id);
                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = authService