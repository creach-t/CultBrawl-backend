const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');

router.post('/', battleController.createBattle);
router.get('/', battleController.getAllBattles);
router.get('/:id', battleController.getBattleById);
router.put('/:id', battleController.updateBattle);
router.delete('/:id', battleController.deleteBattle);
router.post('/:id/vote', battleController.voteForEntity);
router.get('/:id/votes', battleController.getVotesForBattle);
router.get('/:id/user-vote', battleController.getUserVote);

module.exports = router;
