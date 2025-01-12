const jwt = require('jsonwebtoken');

exports.extractUserFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token manquant ou invalide.');
    }
    
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.SECRET_KEY);
  };
  