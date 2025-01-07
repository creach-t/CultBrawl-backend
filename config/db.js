const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '',
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);


const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie.');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
