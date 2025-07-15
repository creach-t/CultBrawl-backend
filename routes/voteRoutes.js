const express = require('express');
const {
  createVote,
  getVotes,
  getVoteById,
  updateVote,
  deleteVote,
  getBattleVoteStats,
  getUserVotes
} = require('../controllers/votesController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { voteLimiter, generalLimiter } = require('../middlewares/rateLimiter');
const { validatePagination } = require('../validations/voteValidation');

const router = express.Router();

/**
 * Middleware de validation pour les paramètres de pagination
 */
const validatePaginationMiddleware = (req, res, next) => {
  const { error, value } = validatePagination(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres de pagination invalides',
      errors: error.details.map(detail => detail.message)
    });
  }
  req.query = value;
  next();
};

// Routes publiques
router.get('/stats/:battleId', generalLimiter, getBattleVoteStats);

// Routes privées (authentification requise)
router.use(verifyToken);

// CRUD des votes
router.route('/')
  .get(generalLimiter, validatePaginationMiddleware, getVotes)
  .post(voteLimiter, createVote);

router.route('/:id')
  .get(generalLimiter, getVoteById)
  .put(voteLimiter, updateVote)
  .delete(generalLimiter, deleteVote);

// Routes spécifiques
router.get('/user/:userId', generalLimiter, validatePaginationMiddleware, getUserVotes);

module.exports = router;
