const { StatusCodes } = require('http-status-codes');
const { Op, Sequelize } = require('sequelize');
const { handleException } = require('../exception');
const { userService, conversationService } = require('../service');
const messageService = require('../service/messageService');
const socketEvents = require('../socket.io/events');

const userController = {
    basicInfo: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.getBasicInfo(id);
            return res.status(StatusCodes.OK).json(user);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    basicMultipleInfo: async (req, res) => {
        try {
            const { ids } = req.params;
            const users = await userService.getBasicMultipleInfo(JSON.parse(ids));
            return res.status(StatusCodes.OK).json(users);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    profile: async (req, res) => {
        try {
            const { id } = req.params;
            const userProfile = await userService.getProfileById(id)
            return res.status(StatusCodes.OK).json(userProfile);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    updateProfile: async (req, res) => {
        try {
            const data = req.body;
            const { id } = req.auth.user;
            const user = await userService.updateProfile(id, data);
            console.log(user)
            return res.status(StatusCodes.OK).json(user)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    getMessages: async (req, res) => {
        try {
            const { otherId, skip, limit } = req.query;
            const { id: myId } = req.auth.user;
            const listMessages = await conversationService.getMessages(myId, otherId, {
                skip: Number(skip) ?? 0,
                limit: Number(limit)
            });
            return res.status(StatusCodes.OK).json(listMessages);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    sendMessages: async (req, res) => {
        try {
            const { io, socket } = req.app.get('socket.io');
            const senderId = req.auth.user.id;
            const { c: conversationId, t: typeChat, id: otherId } = req.query
            const originalMessages = req.body.map(message => ({
                ...message,
                from: senderId
            }));

            const [sender, receiver] = await userService.findAllById([senderId, otherId], {
                attributes: ['id', 'firstName', 'lastName', 'avatar']
            });
            
            const { conversation, insertedMessages } = await userService.sendMessagesToConversation({ conversationId, conversationType: typeChat }, originalMessages);
            
            if (conversation.isNew) {
                await userService.joinConversation(conversation, [senderId, otherId])
                const dataConversation = {
                    id: conversation.id,
                    type: conversation.type,
                    name: conversation.name,
                    avatar: conversation.avatar,
                    lastMessage: insertedMessages.at(-1)
                }
                io.in(otherId).emit(socketEvents.NEW_CHAT, {
                    ...dataConversation,
                    users: [sender]
                })
                io.in(senderId).emit(socketEvents.NEW_CHAT, {
                    ...dataConversation,
                    users: [receiver]
                })
            }
            
            io.in(senderId).emit(socketEvents.NEW_MESSAGE, { messages: insertedMessages, conversationId: conversation.id })
            io.in(otherId).emit(socketEvents.NEW_MESSAGE, { messages: insertedMessages, conversationId: conversation.id })

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

    deleteMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.auth.user;
            const { io } = req.app.get('socket.io');
            const message = await messageService.deleteOneById(id)
            io.in(message.conversationId).emit(socketEvents.DELETE_MESSAGE, {
                id: message.id,
                deletedAt: message.deletedAt,
                conversationId: message.conversationId,
                from: userId
            });
            return res.sendStatus(StatusCodes.OK)
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    getUsers: async (req, res) => {
        try {
            const { search, limit, skip } = req.query;
            let users = []
            users = await userService.getUsers({
                where: {
                    [Op.or]: {
                        phoneNumber: { [Op.like]: `%${search}%` },
                        email: { [Op.like]: `%${search}%` },
                        firstName: { [Op.like]: `%${search}%` },
                        lastName: { [Op.like]: `%${search}%` },
                    }
                },
                attributes: ['id', 'avatar', [Sequelize.fn("concat", Sequelize.col("firstName"), ' ', Sequelize.col("lastName")), 'name'], 'intro'],
                limit: Number(limit),
                offset: Number(skip || 0)
            });
            return res.status(StatusCodes.OK).json(users);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    reactMessage: async(req, res) => {
        try {
            const { io, socket } = req.app.get('socket.io');
            const { messageId } = req.query;
            const { emoji } = req.body;
            const userId = req.auth.user.id;
            const {reaction, conversationId} = await userService.reactMessage(messageId, { emoji, from: userId });
            io.in(conversationId).emit(socketEvents.REACT_MESSAGE, reaction)
            return res.sendStatus(StatusCodes.OK);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    },

    removeReaction: async (req, res) => {
        try {
            const {id: reactionId} = req.params;
            await userService.removeReaction(reactionId);
            return res.sendStatus(StatusCodes.OK);
        } catch (error) {
            const { status, message } = handleException(error);
            return res.status(status).json({ message: message })
        }
    }
}

module.exports = userController;