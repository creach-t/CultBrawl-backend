const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const entityRoutes = require('./entityRoutes');
const battleRoutes = require('./battleRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/entity', entityRoutes);
router.use('/battle', battleRoutes);

module.exports = router;
