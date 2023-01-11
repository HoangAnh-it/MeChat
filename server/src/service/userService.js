const { db } = require('../entity');
const { Op, QueryTypes } = require('sequelize');
const { NotFoundException } = require('../exception')
const conversationService = require('./conversationService');
const messageService = require('./messageService');
const queries = require('../utils/rawQueries');

const userService = {
    findById: (id, options = {}) => {
        return new Promise(async (resolve, reject) => {
            const user = await db.User.findOne({
                where: { id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                ...options
            })

            if (!user) {
                return reject(NotFoundException(`User with id: ${id} not found`));
            }

            resolve(user)
        })
    },

    findAllById: (ids = [], options = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (ids.length === 0) return resolve();
                const users = await db.User.findAll({
                    where: {
                        id: {
                            [Op.or]: ids
                        }
                    },
                    attributes: ['id', 'avatar', 'firstName', 'lastName', 'email', 'phoneNumber'],
                    ...options
                })
                resolve(users)
            } catch (error) {
                reject(error)
            }
        })
    },

    findByUsername: (username, options = {}) => {
        return new Promise(async (resolve, reject) => {
            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: username }, { phoneNumber: username }]
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                ...options
            })

            if (!user) {
                return reject(NotFoundException("You are not a member yet!"));
            }
            resolve(user)
        })
    },

    getBasicInfo: function (id) {
        return this.findById(id, {
            attributes: ['avatar', 'firstName', 'lastName', 'email', 'phoneNumber']
        })
    },

    getBasicMultipleInfo: function(ids) {
        return this.findAllById(ids)
    },

    getProfileById: function (id) {
        return this.findById(id, {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
    },

    joinConversation: function (conversation, ids) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await this.findAllById(ids);
                conversation.addUsers(ids)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    sendMessagesToConversation: ({conversationId, conversationType}, originalMessages) => {
        return new Promise(async (resolve, reject) => {
            try {
                const conversation = await conversationService.findOneOrCreate(conversationId, conversationType);
                const insertedMessages = await conversationService.insertMessages(conversation, originalMessages)
                resolve({ conversation, insertedMessages });
            } catch (error) {
                reject(error)
            }
        })
    },

    updateProfile: function(id, data) {
        return new Promise(async(resolve, reject) => {
            try {
                await db.User.update(data, {
                    where: { id },
                    returning: true,
                    plain: true
                });
                const user = await this.findById(id)
                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
    },

    getUsers: (options) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const users = await db.sequelize.query(queries.findFriends, {
                //     replacements: {
                //         search,
                //         limit: limit,
                //         offset: skip
                //     },
                //     type: QueryTypes.SELECT,
                // })

                const users = await db.User.findAll({...options})

                resolve(users)
            } catch (error) {
                reject(error)
            }
        })
    },

    reactMessage: (messageId, { from, emoji }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const message = await db.Message.findOne({ where: { id: messageId } });
                if (!message) {
                    return reject(NotFoundException('Message cannot be found!'));
                }

                let existingReaction = await db.Reaction.findOne({
                    where: {messageId, from}
                })
                if (existingReaction) {
                    await db.Reaction.update({ emoji }, {
                        where: {messageId, from}
                    })
                    existingReaction.emoji = emoji
                } else {
                    existingReaction = await db.Reaction.create({
                        emoji,
                        from,
                        messageId
                    })
                }

                resolve({reaction: existingReaction, conversationId: message.conversationId})
            } catch (error) {
                reject(error)
            }
        })
    },

    removeReaction: (reactionId) => {
        return new Promise(async(resolve, reject) => {
            try {
                await db.Reaction.destroy({
                    where: {id: reactionId}
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    leftConversation: function(userId, conversationId) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.GroupMember.update({ leftDateTime: Date.now() }, {
                    where: {userId, conversationId}
                })
                const user = await this.findById(userId);
                const lastOrder = await messageService.getLastOrderNumberOfMessageInConversation(conversationId)
                const announcement = await db.Message.create({
                    from: userId,
                    content: `${user.firstName} ${user.lastName} left group.`,
                    conversationId,
                    type: 'announcement',
                    orderNumber: lastOrder + 1
                })
                resolve(announcement)
            } catch (error) {
                reject(error)
            }
        })
    }
    
};

module.exports = userService;