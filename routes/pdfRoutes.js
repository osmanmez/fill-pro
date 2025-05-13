const express = require('express');
const { generateDirectorPDF } = require('../controllers/pdfController');
const router = express.Router();

router.post('/director', generateDirectorPDF);

module.exports = router;
