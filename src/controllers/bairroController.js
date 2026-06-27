const express = require('express');
const router = express.Router();
const Bairro = require('../models/Bairro');

router.get('/', async (req, res) => {
    try {
        const bairros = await Bairro.findAll();
        res.json(bairros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const bairro = await Bairro.findById(req.params.id);
        if (bairro) {
            res.json(bairro);
        } else {
            res.status(404).json({ message: 'Bairro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome_bairro, zona, populacao_estimada, observacoes } = req.body;
        const novoBairro = new Bairro(nome_bairro, zona, populacao_estimada, observacoes);
        const id = await novoBairro.save();
        res.status(201).json({ id, message: 'Bairro criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Bairro.update(req.params.id, req.body);
        res.json({ message: 'Bairro atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Bairro.delete(req.params.id);
        res.json({ message: 'Bairro excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
