const { db } = require('../entity');
const { Op, Sequelize, QueryTypes } = require('sequelize');
const queries = require('../utils/rawQueries');
const messageService = require('./messageService');

const conversationService = {
    getMessages: (myId, otherId, more = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const listMessages = await db.sequelize.query(queries.messages, {
                    replacements: {
                        myId,
                        otherId,
                        ...more
                    },
                    type: QueryTypes.SELECT,
                })

                listMessages.forEach(message => {
                    if (message.reactions === '{}') {
                        message.reactions = []
                    } else {
                        message.reactions = message.reactions.split('&&').map(r => JSON.parse(r))
                    }
                })
                resolve(listMessages)
            } catch (error) {
                reject(error)
            }
        })
    },

    findOne: (options = {}) => {
        return new Promise(async(resolve, reject) => {
            try {
                const conversation = await db.Conversation.findOne({
                    attributes: {
                        exclude: ['createAt', 'updatedAt'],
                    },
                    ...options
                })
                resolve(conversation)
            } catch (error) {
                reject(error)
            }
        })
    },

    createOne: (typeChat) => {
        return new Promise(async (resolve, reject) => {
            try {
                const conversation = await db.Conversation.create({
                    name: 'Happy group!',
                    avatar: null,
                    type: typeChat || 'private'
                })

                resolve(conversation)
            } catch (error) {
                reject(error)
            }
        })
    },

    insertMessages: (conversation, originalMessages) => {
        return new Promise(async (resolve, reject) => {
            try {
                let lastOrderNumber = await messageService.getLastOrderNumberOfMessageInConversation(conversation.id);
                const insertedMessages = await db.Message.bulkCreate(
                    originalMessages.map(message => ({
                        ...message,
                        orderNumber: lastOrderNumber++,
                        conversationId: conversation.id
                    })
                    ), {
                    returning: true
                });
                insertedMessages.forEach(message => {
                    message.dataValues.reactions = []
                })

                resolve(insertedMessages)
            } catch (error) {
                reject(error)
            }
        })
    },

    findOneOrCreate: (conversationId, typeChat) => {
        return new Promise(async (resolve, reject) => {
            try {
                let conversation;
                conversation = await db.Conversation.findOne({
                    where: { id: conversationId }
                })

                if (!conversation) {
                    conversation = await db.Conversation.create({
                        name: 'Happy group!',
                        avatar: '',
                        type: typeChat || 'private'
                    })
                    conversation.isNew = true;
                } else {
                    conversation.isNew = false;
                }

                resolve(conversation)
            } catch (error) {
                reject(error)
            }
        })
    },

    deleteOne: (id) => {
        return new Promise(async(resolve, reject) => {
            try {
                await db.Conversation.destroy({
                    where: { id: id }
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = conversationService