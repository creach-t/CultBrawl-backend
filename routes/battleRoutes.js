const express = require("express");
const router = express.Router();
const battleController = require("../controllers/battleController");
const routeWrapper = require("../utils/routeWrapper");
router.post("/", routeWrapper(battleController.createBattle));
router.get("/", routeWrapper(battleController.getAllBattles));
router.get("/:id", routeWrapper(battleController.getBattleById));
router.put("/:id", routeWrapper(battleController.updateBattle));
router.delete("/:id", routeWrapper(battleController.deleteBattle));
router.post("/:id/votes", routeWrapper(battleController.voteForEntity));
router.get("/:id/votes", routeWrapper(battleController.getVotesForBattle));
router.get("/:id/user-vote", routeWrapper(battleController.getUserVote));

module.exports = router;
