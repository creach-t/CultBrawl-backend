const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');

// Routes pour les entités
router.post('/', entityController.addEntity);  // Ajouter une entité
router.get('/', entityController.getAllEntities);  // Liste des entités
router.get('/leaderboard', entityController.getAllEntitiesByPoints);  // Liste des entités par points
router.get('/:id', entityController.getEntityById);  // Détail d'une entité
router.delete('/:id', entityController.deleteEntity);  // Suppression d'une entité

module.exports = router;
