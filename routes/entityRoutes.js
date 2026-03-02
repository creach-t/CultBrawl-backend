const express = require("express");
const router = express.Router();
const entityController = require("../controllers/entityController");
const routeWrapper = require("../utils/routeWrapper");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", routeWrapper(entityController.addEntity));
router.get("/", routeWrapper(entityController.getAllEntities));
router.get("/leaderboard", routeWrapper(entityController.getTop5EntityByVotes));
router.get("/:id", routeWrapper(entityController.getEntityById));
router.put("/:id", verifyToken, isAdmin, routeWrapper(entityController.updateEntity));
router.delete("/:id", verifyToken, isAdmin, routeWrapper(entityController.deleteEntity));

module.exports = router;
