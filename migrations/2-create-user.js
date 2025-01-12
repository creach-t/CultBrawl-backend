'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Création de la table Users
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50] 
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [30]
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      recoveryToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      acceptedCGV: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',  // Référence la table des rôles
          key: 'id'
        }
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,  // Les utilisateurs commencent avec 0 points par défaut
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });

    // Insertion de l'administrateur
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: '$2b$10$0A2v8Swa44a2p1zbpTSa/e17pXgl6P/XfSeFCwCeITQw8wCKnnbwG',
      email: 'admin@cultbrawl.com',
      firstname: 'Super',
      lastname: 'Admin',
      roleId: 2, 
      acceptedCGV: true,
      points: 1000,  // L'administrateur commence avec 1000 points
    }]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
