const db = require('../db');

class Bairro {
    constructor(nome_bairro, zona, populacao_estimada, observacoes) {
        this.nome_bairro = nome_bairro;
        this.zona = zona;
        this.populacao_estimada = populacao_estimada;
        this.observacoes = observacoes;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM Bairro');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM Bairro WHERE id_bairro = ?', [id]);
        return rows[0];
    }

    async save() {
        const [result] = await db.query(
            'INSERT INTO Bairro (nome_bairro, zona, populacao_estimada, observacoes) VALUES (?, ?, ?, ?)',
            [this.nome_bairro, this.zona, this.populacao_estimada, this.observacoes]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { nome_bairro, zona, populacao_estimada, observacoes } = data;
        await db.query(
            'UPDATE Bairro SET nome_bairro = ?, zona = ?, populacao_estimada = ?, observacoes = ? WHERE id_bairro = ?',
            [nome_bairro, zona, populacao_estimada, observacoes, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Bairro WHERE id_bairro = ?', [id]);
    }
}

module.exports = Bairro;
