const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const path = require('path');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('./tasks/updateBattles');


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

const uploadsDir = path.join(__dirname, 'uploads'); // Chemin vers le dossier des fichiers uploadés
app.use('/uploads', express.static(uploadsDir)); // Les fichiers seront accessibles à /uploads/<filename>

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
