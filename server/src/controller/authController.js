const { StatusCodes } = require('http-status-codes');
const { handleException } = require('../exception');

const {authService} = require('../service')

const authController = {
    login: async (req, res) => {
        try {
            const data = await authService.login(req.body)
            res.cookie('access_token', `Bearer ${data.accessToken}`, {
            path: '/',
            httpOnly: true,
            secure: true,
            // sameSite: 'strict',
            maxAge: 86400 * 1000, // 1day
        });
            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }
    },

    signup: async(req, res) => {
        try {
            await authService.signup(req.body);
            return res.status(StatusCodes.OK).json({ message: 'Sign up successfully.' });
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie('access_token')
            return res.sendStatus(StatusCodes.OK)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }  
    },

    authenticate: async (req, res) => {
        try {
            const user = await authService.authenticate(req.auth.user.id);
            return res.status(StatusCodes.OK).json({ user, accessToken: req.auth.accessToken });
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }
    }
}

module.exports = authController;