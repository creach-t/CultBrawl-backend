'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Battle.init({
    entity1Id: DataTypes.INTEGER,
    entity2Id: DataTypes.INTEGER,
    durationHours: DataTypes.INTEGER,
    endTime: DataTypes.DATE,
    winnerId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    createdById: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Battle',
  });
  return Battle;
};