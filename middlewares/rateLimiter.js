const rateLimit = require('express-rate-limit');
const { AppError } = require('../utils/AppError');

/**
 * Rate limiter général pour toutes les routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par fenêtre de temps
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter strict pour les votes
 */
const voteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Maximum 5 votes par minute
  message: {
    success: false,
    message: 'Limite de votes atteinte. Veuillez attendre avant de voter à nouveau.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Utiliser l'ID utilisateur pour le rate limiting si disponible
    return req.user?.id ? `vote_${req.user.id}` : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Limite de votes atteinte. Veuillez attendre avant de voter à nouveau.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Rate limiter pour l'authentification
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 tentatives de connexion par IP
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour la création de contenu
 */
const createLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Maximum 10 créations par 5 minutes
  message: {
    success: false,
    message: 'Limite de création atteinte. Veuillez attendre avant de créer du nouveau contenu.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  voteLimiter,
  authLimiter,
  createLimiter
};
