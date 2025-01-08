'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relations avec les batailles en tant qu'entité 1 ou 2
      Entity.hasMany(models.Battle, {
        foreignKey: 'entity1Id',
        as: 'BattlesAsEntity1',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Entity.hasMany(models.Battle, {
        foreignKey: 'entity2Id',
        as: 'BattlesAsEntity2',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Relation avec les batailles gagnées
      Entity.hasMany(models.Battle, {
        foreignKey: 'winnerId',
        as: 'BattlesWon',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // Relation many-to-many (au cas où tu veux des batailles multiples)
      Entity.belongsToMany(models.Battle, {
        through: 'BattleEntities',
        foreignKey: 'entityId',
        as: 'Participations'
      });
    }
  }
  Entity.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le nom de l'entité est requis."
        },
        len: {
          args: [3, 100],
          msg: "Le nom doit contenir entre 3 et 100 caractères."
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['movie', 'book', 'serie', 'anime', 'game', 'other']],
          msg: "Le type doit être 'movie', 'book', 'serie', 'anime', 'game' ou 'other'."
        }
      }
    },
    apiId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Cette entité existe déjà dans la base de données."
      },
      validate: {
        notEmpty: {
          msg: "L'identifiant API est requis."
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "L'URL de l'image n'est pas valide."
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "La description ne peut pas dépasser 500 caractères."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Entity',
    tableName: 'Entities',
    timestamps: false,
    paranoid: true,
    underscored: false
  });
  return Entity;
};
