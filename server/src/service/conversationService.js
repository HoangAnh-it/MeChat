const { db } = require('../entity');
const { Op, Sequelize, QueryTypes } = require('sequelize');
const queries = require('../utils/rawQueries');
const messageService = require('./messageService');

const conversationService = {
    getMessages: (conversationId, more = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const listMessages = await db.sequelize.query(queries.messages, {
                    replacements: {
                        conversationId,
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
    },

    getDetail: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const identicalConversations = await db.Conversation.findAll({
                    where: {id},
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [{
                        model: db.User,
                        attributes: ['id', 'avatar', [Sequelize.fn("concat", Sequelize.col("firstName"), ' ', Sequelize.col("lastName")), 'name'], 'email', 'phoneNumber'],
                        through: {
                            attributes: []
                        }
                    }],
                    raw: true,
                    nest: true
                })

                let { Users, ...res } = identicalConversations[0];
                res.users = [];
                for (const con of identicalConversations) {
                    res.users = [
                        ...res.users,
                        con.Users
                    ]
                }

                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    },

    createConversation: function(userId, data)  {
        return new Promise(async (resolve, reject) => {
            try {
                const { avatar, name, members } = data;
                const conversation = await db.Conversation.create({
                    name, avatar,
                    type: 'public',
                    admin: userId
                });

                await this.joinConversation(conversation, [...members, userId]);
                resolve(conversation)
            } catch (error) {
                reject(error)
            }
        })
    },

    joinConversation: function (conversation, ids) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await db.User.findAll({
                    where: {
                        id: {
                            [Op.or]: ids
                        }
                    },
                    attributes: ['id', 'avatar', 'firstName', 'lastName', 'email', 'phoneNumber'],
                })
                conversation.addUsers(ids)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    update: (id, dataUpdated) => {
        return new Promise(async(resolve, reject) => {
            try {
                await db.Conversation.update(dataUpdated, { where: { id } });
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    addUser: function(id, userIds)  {
        return new Promise(async (resolve, reject) => {
            try {
                await db.GroupMember.bulkCreate(userIds.map(userId => ({
                    userId,
                    conversationId: id
                })))
                const users = await db.User.findAll({
                    where: {
                        id: userIds
                    },
                    attributes: ['id', 'avatar', 'firstName', 'lastName', 'email', 'phoneNumber'],
                })
                resolve(users);
            } catch (error) {
                reject(error)
            }
        })
    },

    deleteUserFromConversation: function (conversationId, userId) {
        return new Promise(async (resolve, reject) =>{
            try {
                await db.GroupMember.destroy({
                    where: {
                        userId,
                        conversationId
                    }
                })
                resolve(userId)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = conversationService