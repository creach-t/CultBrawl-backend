'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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

    // Insérer des rôles par défaut
    await queryInterface.bulkInsert('Roles', [
      { name: 'user' },
      { name: 'admin' },
      { name: 'premium'}
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};
