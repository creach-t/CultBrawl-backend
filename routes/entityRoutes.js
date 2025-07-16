const express = require("express");
const router = express.Router();
const entityController = require("../controllers/entityController");
const routeWrapper = require("../utils/routeWrapper"); // AJOUTEZ

router.post("/", routeWrapper(entityController.addEntity));
router.get("/", routeWrapper(entityController.getAllEntities));
router.get("/leaderboard", routeWrapper(entityController.getTop5EntityByVotes));
router.get("/:id", routeWrapper(entityController.getEntityById));
router.delete("/:id", routeWrapper(entityController.deleteEntity));

module.exports = router;
