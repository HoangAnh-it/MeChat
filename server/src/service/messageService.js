const {db} = require('../entity');

const messageService = {
    countMessagesInConversation: async (conversationId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const numberOfMessages = await db.Message.count({
                    where: {conversationId}
                })
                return resolve(numberOfMessages)
            } catch (error) {
                reject(error)
            }
        })
    },

    getLastOrderNumberOfMessageInConversation: async (conversationId) => { // conversation is already exist.
        return new Promise(async(resolve, reject) => {
            try {
                const message = await db.Message.findOne({
                    where: { conversationId },
                    attributes: ['orderNumber'],
                    order: [['orderNumber', 'DESC']],
                    limit: 1
                })

                if(!message) return resolve(0)
                return resolve(message.orderNumber + 1)
            } catch (error) {
                reject(error)
            }
        })
    },

    deleteOneById: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.Message.update({
                    deletedAt: new Date()
                }, { where: { id } });

                const message = db.Message.findOne({ where: { id } });
                resolve(message)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports =messageService;