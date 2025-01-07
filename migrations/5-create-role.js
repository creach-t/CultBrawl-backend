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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Insérer des rôles par défaut
    await queryInterface.bulkInsert('Roles', [
      { name: 'user', createdAt: new Date(), updatedAt: new Date() },
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'premium', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};
