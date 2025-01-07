const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      message: err.message || 'Erreur interne du serveur.',
    });
  };
  
  module.exports = errorHandler;
  