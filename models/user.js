'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * Cette méthode sera appelée automatiquement par Sequelize.
     */
    static associate(models) {
      // Association avec le modèle Role
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    }
  }
  
  User.init({
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 50],
          msg: "Le nom d'utilisateur doit comporter entre 3 et 50 caractères."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [30],
          msg: 'Le mot de passe doit comporter au moins 30 caractères.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Veuillez fournir une adresse email valide."
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recoveryToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acceptedCGV: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      },
      validate: {
        notNull: {
          msg: "Le rôle est obligatoire."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};
