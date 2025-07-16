const AppError = require('../utils/AppError');

/**
 * Middleware global de gestion des erreurs
 * Doit être placé à la fin de toutes les routes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur pour le débogage
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(error => error.message).join(', ');
    error = new AppError(message, 400);
  }

  // Erreur de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Cette ressource existe déjà';
    error = new AppError(message, 400);
  }

  // Erreur de clé étrangère Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Référence invalide vers une ressource inexistante';
    error = new AppError(message, 400);
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = new AppError(message, 401);
  }

  // Erreur de cast (ID invalide)
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = new AppError(message, 404);
  }

  // Erreur de validation Joi
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
