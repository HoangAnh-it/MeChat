const { hash } = require('../utils/bcrypt');
const { randomString } = require('../utils/uuid');

const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            field: 'id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        email: {
            field: 'email',
            type: DataTypes.STRING,
            unique: true
        },
        
        password: {
            field: 'password',
            type: DataTypes.STRING,
        },
        
        firstName: {
            field: 'firstName',
            type: DataTypes.STRING,
        },
    
        lastName: {
            field: 'lastName',
            type: DataTypes.STRING,
        },
        
        avatar: {
            field: 'avatar',
            type: DataTypes.STRING,
        },
    
        phoneNumber: {
            field: 'phoneNumber',
            type: DataTypes.STRING,
            unique: true
        },

        intro: {
            field: 'intro',
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

    User.beforeCreate(async (user, options) => {
        const hashedPassword = hash(user.password);
        user.password = hashedPassword;
    })

    return User;
}

module.exports = UserModel;
