
const MessageModel = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            field: 'id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    
        from: {
            field: 'from',
            type: DataTypes.STRING,
        },
        
        content: {
            field: 'content',
            type: DataTypes.STRING,
        },
    
        sentDateTime: {
            field: 'sentDateTime',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    
        conversationId: {
            field: 'conversationId',
            type: DataTypes.STRING,
        },

        type: {
            field: 'type',
            type: DataTypes.STRING,
        },

        orderNumber: {
            field: 'orderNumber',
            type: DataTypes.INTEGER
        },

        deletedAt: {
            field: 'deletedAt',
            type: DataTypes.DATE,
        }
    }, {
        timestamp: true,
    }
    );

    return Message;
}


module.exports = MessageModel;
