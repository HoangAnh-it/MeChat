const GroupMemberModel = (sequelize, DataTypes) => {
    const GroupMember = sequelize.define('GroupMember', {
        userId: {
            field: 'userId',
            type: DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    
        conversationId: {
            field: 'conversationId',
            type: DataTypes.STRING,
            references: {
                model: 'Conversations',
                key: 'id'
            }
        },
    
        joinedDateTime: {
            field: 'joinedDateTime',
            type: DataTypes.DATE
        },
    
        leftDateTime: {
            field: 'leftDateTime',
            type: DataTypes.DATE
        }
        
    },
        {
            timestamp: true,
        }
    );

    return GroupMember;
}


module.exports = GroupMemberModel;
