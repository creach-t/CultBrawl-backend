/**
 * Wrapper pour gérer automatiquement les erreurs async/await dans Express
 * Évite d'avoir à répéter try/catch dans chaque controller
 * 
 * @param {Function} fn - Fonction async à wrapper
 * @returns {Function} - Middleware Express
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
