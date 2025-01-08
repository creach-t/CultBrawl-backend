'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 255]
        }
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [['movie', 'book', 'serie', 'anime', 'game', 'other']]  // Types restreints à des valeurs spécifiques
        }
      },
      apiId: {
        type: Sequelize.STRING(100),
        allowNull: true,  // Certaines entités peuvent être ajoutées manuellement
        validate: {
          len: [1, 100]
        }
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: true  // Assure que c'est bien une URL
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,  // La description peut être vide
        validate: {
          len: [0, 2000]  // Description limitée à 2000 caractères
        }
      },
      source: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'manual',  // Par défaut, ajouté manuellement si aucune API n'est indiquée
        validate: {
          isIn: [['manual', 'OMDB', 'TMDB', 'GoogleBooks', 'IGDB']]
        }
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
    await queryInterface.dropTable('Entities');
  }
};
