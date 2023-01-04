const ReactionModel = (sequelize, DataTypes) => {
    const Reaction = sequelize.define('Reaction', {
        id: {
            field: 'id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    
        emoji: {
            field: 'emoji',
            type: DataTypes.STRING,
        },

        from: {
            field: 'from',
            type: DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        
        messageId: {
            field: 'messageId',
            type: DataTypes.STRING,
        },
    
    }, {
        timestamp: true,
    }
    );
    return Reaction;
}


module.exports = ReactionModel;
