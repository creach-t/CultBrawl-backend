const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const routeWrapper = require('../utils/routeWrapper');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, routeWrapper(authController.register));
router.post('/login', authLimiter, routeWrapper(authController.login));
router.get('/check-username', routeWrapper(authController.checkUsername));
router.get('/profile', routeWrapper(authController.profile));

module.exports = router;
