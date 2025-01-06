const express = require('express');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');  // Import du routeur

dotenv.config();
const app = express();
app.use(express.json());

const sequelize = new Sequelize('cultbrawl', 'cultbrawl', 'cultbrawl', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

// Monter les routes d'authentification
app.use('/api', authRoutes);  // Préfixer toutes les routes par /api

app.get('/', (req, res) => {
  res.send('CultBrawl Backend is running!');
});

app.listen(3000, '0.0.0.0', async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie.');
    console.log('Serveur lancé sur http://localhost:3000');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
  }
});
