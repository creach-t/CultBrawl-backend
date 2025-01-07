'use strict';
const { User, Role } = require('../models');


exports.getUserByToken = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader) {
        return res.status(401).json({ error: 'Token non fourni' });
      }
  
      const token = authHeader.split(' ')[1];  // Récupération du token Bearer
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Vérification et décodage du token
  
      const user = await User.findByPk(decoded.userId, {
        include: [{ model: Role, as: 'role' }]
      });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalide' });
      }
      if (error.name === 'TokenExpiredError') {
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
