const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token manquant.' });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide.' });
    req.user = user;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id, { attributes: ['roleId'] });
    if (!user || user.roleId !== 2) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    }
    next();
  } catch {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const verifyBattleAccess = async (req, res, next) => {
  try {
    const { User, Battle } = require('../models');
    const [user, battle] = await Promise.all([
      User.findByPk(req.user.id, { attributes: ['roleId'] }),
      Battle.findByPk(req.params.id, { attributes: ['createdById'] }),
    ]);
    if (!battle) return res.status(404).json({ message: 'Battle non trouvée.' });
    if (user?.roleId !== 2 && battle.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    next();
  } catch {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { verifyToken, isAdmin, verifyBattleAccess };
