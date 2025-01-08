const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const validatePassword = (password) => {
  const length = password.length >= 8;
  const uppercase = /[A-Z]/.test(password);
  const number = /\d/.test(password);
  const specialChar = /[!@#$%^&*()/,.?":{}|<>]/.test(password);

  console.log('Mot de passe reçu:', password);
  console.log('Validation du mot de passe :', {
    length,
    uppercase,
    number,
    specialChar
  });

  return length && uppercase && number && specialChar;
};

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ message: 'Le nom d’utilisateur doit contenir entre 3 et 50 caractères.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Nom d’utilisateur déjà pris.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, roleId: 1 });

    res.json({
      message: 'Compte créé avec succès.',
      user: { id: user.id, username: user.username, roleId: user.roleId }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Identifiants incorrects.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Identifiants incorrects.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({
      message: 'Connexion réussie.',
      token,
      user: { id: user.id, username: user.username, roleId: user.roleId }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};

const checkUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d’utilisateur.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      res.status(400).json({ message: 'Nom d’utilisateur déjà pris.' });
    } else {
      res.json({ message: 'Nom d’utilisateur disponible.' });
    }
  } catch (error) {
    console.error('Erreur Sequelize:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du nom d’utilisateur.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
};

module.exports = { register, login, checkUsername, getProfile };
