const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const routeWrapper = require('../utils/routeWrapper');

router.post('/register', routeWrapper(authController.register));
router.post('/login', routeWrapper(authController.login));
router.get('/check-username', routeWrapper(authController.checkUsername));
router.get('/profile', routeWrapper(authController.profile));

module.exports = router;
