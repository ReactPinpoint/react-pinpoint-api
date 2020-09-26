const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./index');

class User extends Model {};

const hashPassword = async (user) => {
  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return;
  } catch (err) {
    return err;
  }
};

User.init({
  user_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull:false,
    primaryKey: true,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { 
  sequelize, 
  modelName: 'user', 
  timestamps: false,
});

User.beforeCreate(hashPassword);

User.prototype.validatePassword = async (password, user) => {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (err) {
    return err;
  }
};

class Project extends Model {};

Project.init({
  project_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull:false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { 
  sequelize, 
  modelName: 'project',
  timestamps: false,
});

class Commit extends Model {};

Commit.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull:false,
    primaryKey: true,
    unique: true,
  },
  component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  component_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  self_base_duration: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  parent_component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  component_state: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  sibling_component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { 
  sequelize, 
  modelName: 'commit',
  timestamps: false,
});

User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Commit);
Commit.belongsTo(Project);

module.exports = {
  User, Project, Commit,
};
