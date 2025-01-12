const express = require('express');
const { uploadPhoto } = require('../controllers/uploadController');
const router = express.Router();

// Route pour uploader une photo
router.post('/', uploadPhoto);

module.exports = router;
