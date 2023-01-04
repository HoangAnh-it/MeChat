const ConversationModel = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        id: {
            field: 'id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    
        name: {
            field: 'name',
            type: DataTypes.STRING,
        },

        avatar: {
            field: 'avatar',
            type: DataTypes.STRING,
        },

        type: {
            field: 'type',
            type: DataTypes.STRING,
        }
    }, {
        timestamp: true,
    }
    );

    return Conversation;
}

module.exports = ConversationModel;
