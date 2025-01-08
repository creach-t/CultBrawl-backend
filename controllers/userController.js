'use strict';
const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');



exports.getUserByToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);  // Log de l'en-tête Authorization

    if (!authHeader) {
      console.log('Erreur: Aucun token fourni');
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];  // Récupération du token Bearer
    console.log('Token extrait:', token);

    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Vérification et décodage du token
    console.log('Token décodé:', decoded);

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (user) {
      console.log('Utilisateur trouvé:', user);
      res.status(200).json(user);
    } else {
      console.log('Utilisateur non trouvé pour l\'ID:', decoded.id);
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.log('Erreur attrapée dans le catch:', error);

    if (error.name === 'JsonWebTokenError') {
      console.log('Erreur: Token invalide');
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      console.log('Erreur: Token expiré');
      return res.status(401).json({ error: 'Token expiré' });
    }
    res.status(500).json({ error: error.message });
  }
};


// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { username, email, firstname, lastname, roleId } = req.body;
    const user = await User.findByPk(req.params.id);

    if (user) {
      await user.update({
        username,
        email,
        firstname,
        lastname,
        roleId
      });
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
