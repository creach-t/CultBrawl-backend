const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes'); // Index des routes
const { connectToDatabase } = require('./config/db');  // Connexion DB
const errorHandler = require('./middlewares/errorHandler');  // Middleware global pour gérer les erreurs

dotenv.config();
const app = express();
app.use(express.json());

// Validation des variables d'environnement
const requiredEnv = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'SECRET_KEY'];
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Erreur : ${envVar} n'est pas défini dans le fichier .env`);
    process.exit(1);
  }
});

// Connexion à la base de données
connectToDatabase();

// Monter les routes
app.use('/api', routes);

// Route par défaut
app.get('/', (req, res) => {
  res.send('CultBrawl Backend is running!');
});

// Middleware de gestion des erreurs (à la fin de toutes les routes)
app.use(errorHandler);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
