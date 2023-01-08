const { StatusCodes } = require('http-status-codes');
const { handleException } = require('../exception');
const {conversationService} = require('../service');


const conversationController = {
    getDetail: async(req, res) => {
        try {
            const { id } = req.params;
            const conversationDetail = await conversationService.getDetail(id)
            return res.status(StatusCodes.OK).json(conversationDetail)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({message: message})
        }
    },

    createConversation: async (req, res) => {
        try {
            const data = req.body;
            const userId = req.auth.user.id;
            await conversationService.createConversation(userId, data);
            return res.sendStatus(StatusCodes.OK);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const { id } = req.params;
            await conversationService.deleteOne(id);
            return res.sendStatus(StatusCodes.OK);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    update: async (req, res) => {
        try {
            const {id} = req.query
            const dataUpdated = req.body
            await conversationService.update(id, dataUpdated);
            return res.status(StatusCodes.OK).json(dataUpdated)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    addUser: async (req, res) => {
        try {
            const { id } = req.query;
            const userIds = req.body;
            const resData = await conversationService.addUser(id, userIds)
            return res.status(StatusCodes.OK).json(resData);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id, userId } = req.query;
            const deletedUserId = await conversationService.deleteUserFromConversation(id, userId)
            return res.status(StatusCodes.OK).json(deletedUserId)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    }
}

module.exports = conversationController;