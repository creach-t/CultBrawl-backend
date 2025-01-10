'use strict';
const { Model, Op } = require('sequelize'); // Importation de Op pour les opérateurs Sequelize

module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {
    static associate(models) {
      // Relation avec les entités participantes
      Battle.belongsTo(models.Entity, {
        foreignKey: 'entity1Id',
        as: 'Entity1',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Battle.belongsTo(models.Entity, {
        foreignKey: 'entity2Id',
        as: 'Entity2',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Relation avec l'entité gagnante
      Battle.belongsTo(models.Entity, {
        foreignKey: 'winnerId',
        as: 'Winner',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // Relation avec l'utilisateur qui a créé la bataille
      Battle.belongsTo(models.User, {
        foreignKey: 'createdById',
        as: 'Creator',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Battle.init(
    {
      entity1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Entity1Id est requis' },
          isInt: { msg: 'Entity1Id doit être un entier' },
        },
      },
      entity2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Entity2Id est requis' },
          isInt: { msg: 'Entity2Id doit être un entier' },
        },
      },
      durationHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 24,
        validate: {
          isInt: { msg: 'La durée doit être un entier' },
          min: { args: [1], msg: 'La durée doit être d\'au moins 1 heure' },
        },
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: 'La date de fin est requise' },
          isDate: { msg: 'La date de fin doit être une date valide' },
        },
      },
      winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: 'WinnerId doit être un entier' },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          notNull: { msg: 'Le statut est requis' },
          isIn: {
            args: [['pending', 'active', 'completed', 'cancelled']],
            msg: 'Statut invalide',
          },
        },
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'L\'ID du créateur est requis' },
          isInt: { msg: 'L\'ID du créateur doit être un entier' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Battle',
      tableName: 'Battles',
      timestamps: false,
      paranoid: true, 
      underscored: false,
    }
  );

  // Méthode statique pour mettre à jour les batailles expirées
  Battle.updateExpiredBattles = async function () {
    const now = new Date();
    try {
      const updatedBattles = await this.update(
        { status: 'completed' },
        {
          where: {
            status: 'pending',
            endTime: {
              [Op.lt]: now,
            },
          },
        }
      );
      console.log(`Mises à jour des battles expirées : ${updatedBattles[0]}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des battles expirées :', error);
    }
  };

  return Battle;
};
