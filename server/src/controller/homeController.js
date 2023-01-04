const { StatusCodes } = require('http-status-codes');
const { handleException } = require('../exception');
const {homeService} = require('../service');

const homeController = {

    allConversations: async(req, res) => {
        try {
            const { id } = req.auth.user;
            const chats = await homeService.allConversations(id)
            return res.status(StatusCodes.OK).json(chats)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }
    }
}

module.exports = homeController;
