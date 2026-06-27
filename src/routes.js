const express = require('express');
const router = express.Router();

const cidadaoController = require('./controllers/cidadaoController');
const agenteController = require('./controllers/agenteController');
const bairroController = require('./controllers/bairroController');
const ocorrenciaController = require('./controllers/ocorrenciaController');

// Define API routes
router.use('/cidadaos', cidadaoController);
router.use('/agentes', agenteController);
router.use('/bairros', bairroController);
router.use('/ocorrencias', ocorrenciaController);

module.exports = router;
