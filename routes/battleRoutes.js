const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');

router.post('/', battleController.createBattle);
router.get('/', battleController.getAllBattles);
router.get('/:id', battleController.getBattleById);
router.put('/:id', battleController.updateBattle);
router.delete('/:id', battleController.deleteBattle);

module.exports = router;
