const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);  // /api/auth pour les routes d'authentification
router.use('/users', userRoutes);  // /api/auth pour les routes d'authentification

module.exports = router;
