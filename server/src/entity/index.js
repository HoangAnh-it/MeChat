'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// define all associations
db.Message = require('./message')(sequelize, Sequelize.DataTypes);
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Conversation = require('./conversation')(sequelize, Sequelize.DataTypes);
db.GroupMember = require('./groupMember')(sequelize, Sequelize.DataTypes);
db.Reaction = require('./reaction')(sequelize, Sequelize.DataTypes);

// conversation - message
db.Conversation.hasMany(db.Message, {
  foreignKey: 'conversationId'
});
db.Message.belongsTo(db.Conversation);

// conversation - contact
db.Conversation.belongsToMany(db.User, {
  through: db.GroupMember,
  foreignKey: 'conversationId',
  otherKey: 'userId'
});
db.User.belongsToMany(db.Conversation, {
  through: db.GroupMember,
  foreignKey: 'userId',
  otherKey: 'conversationId'
});

// reaction
db.Message.hasMany(db.Reaction, {
  foreignKey: 'messageId',
  as: 'reaction'
})
db.Reaction.belongsTo(db.Message)

const connectDatabase = () => {
  sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));
}

module.exports = {db,connectDatabase};
