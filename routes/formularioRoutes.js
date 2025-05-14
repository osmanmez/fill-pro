const express = require('express');
const { createFormulario, getFormularios } = require('../controllers/formularioController');
const router = express.Router();

router.post('/formularios', createFormulario);
router.get('/formularios', getFormularios);

module.exports = router;