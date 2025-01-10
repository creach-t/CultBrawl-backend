'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      battleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Battles', // Nom de la table Battles
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Nom de la table Users
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      votedEntityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Entities', // Nom de la table Entities
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      }
    });

    // Ajout d'une contrainte unique pour éviter les votes multiples d'un utilisateur dans une même bataille
    await queryInterface.addConstraint('Votes', {
      fields: ['battleId', 'userId'],
      type: 'unique',
      name: 'unique_vote_per_user_per_battle'
    });
  },
  async down(queryInterface, Sequelize) {
    // Suppression de la contrainte unique
    await queryInterface.removeConstraint('Votes', 'unique_vote_per_user_per_battle');
    // Suppression de la table
    await queryInterface.dropTable('Votes');
  }
};
