const express = require('express');
const router = express.Router();
const Agente = require('../models/Agente');

router.get('/', async (req, res) => {
    try {
        const agentes = await Agente.findAll();
        res.json(agentes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const agente = await Agente.findById(req.params.id);
        if (agente) {
            res.json(agente);
        } else {
            res.status(404).json({ message: 'Agente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome, cpf, email, telefone, matricula, cargo, turno } = req.body;
        const novoAgente = new Agente(nome, cpf, email, telefone, matricula, cargo, turno);
        const id = await novoAgente.save();
        res.status(201).json({ id, message: 'Agente criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Agente.update(req.params.id, req.body);
        res.json({ message: 'Agente atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Agente.delete(req.params.id);
        res.json({ message: 'Agente excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
