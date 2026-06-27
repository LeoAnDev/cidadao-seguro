const express = require('express');
const router = express.Router();
const Cidadao = require('../models/Cidadao');

router.get('/', async (req, res) => {
    try {
        const cidadaos = await Cidadao.findAll();
        res.json(cidadaos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cidadao = await Cidadao.findById(req.params.id);
        if (cidadao) {
            res.json(cidadao);
        } else {
            res.status(404).json({ message: 'Cidadão não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, data_nascimento } = req.body;
        const novoCidadao = new Cidadao(nome, cpf, email, telefone, endereco, data_nascimento);
        const id = await novoCidadao.save();
        res.status(201).json({ id, message: 'Cidadão criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Cidadao.update(req.params.id, req.body);
        res.json({ message: 'Cidadão atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Cidadao.delete(req.params.id);
        res.json({ message: 'Cidadão excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
