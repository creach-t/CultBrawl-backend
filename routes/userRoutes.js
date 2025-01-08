'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const routeWrapper = require('../utils/routeWrapper');

router.get('/', routeWrapper(userController.getUserByToken));
router.put('/:id', routeWrapper(userController.updateUser));
router.delete('/:id', routeWrapper(userController.deleteUser));

module.exports = router;
