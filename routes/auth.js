const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = 'supersecretkey';

// Route pour l'inscription
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'Compte créé avec succès' });
  } catch (error) {
    // Gérer les erreurs Sequelize (ex: contrainte d'unicité)
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Nom d’utilisateur déjà pris' });
    } else {
      console.error('Erreur lors de l’inscription:', error);
      res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard.' });
    }
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d’utilisateur et un mot de passe.' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
});

module.exports = router;