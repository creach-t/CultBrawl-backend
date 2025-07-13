const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const battleRoutes = require('./battleRoutes');
const entityRoutes = require('./entityRoutes');
const uploadRoutes = require('./uploadRoutes');
const voteRoutes = require('./voteRoutes');
const { generalLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Appliquer le rate limiting général à toutes les routes
router.use(generalLimiter);

// Monter les routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/battles', battleRoutes);
router.use('/entities', entityRoutes);
router.use('/upload', uploadRoutes);
router.use('/votes', voteRoutes);

// Route de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CultBrawl API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
