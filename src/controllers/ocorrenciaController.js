const express = require('express');
const router = express.Router();
const Ocorrencia = require('../models/Ocorrencia');

router.get('/', async (req, res) => {
    try {
        const ocorrencias = await Ocorrencia.findAll();
        res.json(ocorrencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ocorrencia = await Ocorrencia.findById(req.params.id);
        if (ocorrencia) {
            res.json(ocorrencia);
        } else {
            res.status(404).json({ message: 'Ocorrência não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status } = req.body;
        const novaOcorrencia = new Ocorrencia(id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status);
        const id = await novaOcorrencia.save();
        res.status(201).json({ id, message: 'Ocorrência criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Ocorrencia.update(req.params.id, req.body);
        res.json({ message: 'Ocorrência atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Ocorrencia.delete(req.params.id);
        res.json({ message: 'Ocorrência excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
