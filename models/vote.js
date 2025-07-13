'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relation avec la bataille
      Vote.belongsTo(models.Battle, {
        foreignKey: 'battleId',
        as: 'Battle',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Relation avec l'utilisateur
      Vote.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Relation avec l'entité votée
      Vote.belongsTo(models.Entity, {
        foreignKey: 'votedEntityId',
        as: 'VotedEntity',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Vote.init(
    {
      battleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'La bataille associée est obligatoire.' },
          isInt: { msg: 'L\'ID de la bataille doit être un entier.' },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'L\'utilisateur associé est obligatoire.' },
          isInt: { msg: 'L\'ID de l\'utilisateur doit être un entier.' },
        },
      },
      votedEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'L\'entité votée est obligatoire.' },
          isInt: { msg: 'L\'ID de l\'entité votée doit être un entier.' },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      sequelize,
      modelName: 'Vote',
      timestamps: true,
      underscored: false,
      indexes: [
        {
          unique: true,
          fields: ['battleId', 'userId'],
          name: 'unique_vote_per_battle_per_user'
        },
        {
          fields: ['battleId']
        },
        {
          fields: ['userId']
        },
        {
          fields: ['votedEntityId']
        }
      ]
    }
  );

  return Vote;
};
