'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Un rôle peut être attribué à plusieurs utilisateurs
      Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    }
  }
  
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};
