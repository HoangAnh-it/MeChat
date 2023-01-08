const { db } = require('../entity');
const { QueryTypes } = require('sequelize');
const queries = require('../utils/rawQueries');

const homeService = {
    /**
     * friend : {id, avatar, firstName, lastName}
     * inbox: {id, lastMessage}
     */
    allConversations: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const chats = await db.sequelize.query(queries.chatsPreview, {
                    replacements: {
                        userId: userId
                    },
                    type: QueryTypes.SELECT,
                })
                

                chats.forEach(chat => {
                    chat.users = chat.users.split('&&').map(user => JSON.parse(user));
                    if (chat.conversationType === 'private') {
                        chat.lastMessage = JSON.parse(chat.lastMessage)
                    } else if (chat.conversationType === 'public') {
                        chat.lastMessage = JSON.parse(chat.lastMessage.split('&&')[0]);
                    }
                })

                resolve(chats);
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = homeService;