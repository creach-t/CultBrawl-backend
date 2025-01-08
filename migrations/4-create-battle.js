'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Battles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entity1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Entities',  // Assure-toi que cette table existe
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      entity2Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Entities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      durationHours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 24  // Durée par défaut d'une bataille
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      winnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Entities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'  // Si l'entité gagnante est supprimée, la valeur devient NULL
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'  // Valeur par défaut du statut
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Créateur de la bataille
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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Battles');
  }
};
