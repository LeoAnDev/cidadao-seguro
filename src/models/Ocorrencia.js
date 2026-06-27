const db = require('../db');

class Ocorrencia {
    constructor(id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status) {
        this.id_cidadao = id_cidadao;
        this.id_agente = id_agente;
        this.id_bairro = id_bairro;
        this.tipo_ocorrencia = tipo_ocorrencia;
        this.descricao = descricao;
        this.data_hora = data_hora;
        this.status = status;
    }

    static async findAll() {
        const query = `
            SELECT o.*, c.nome as nome_cidadao, a.nome as nome_agente, b.nome_bairro
            FROM Ocorrencia o
            LEFT JOIN Cidadao c ON o.id_cidadao = c.id_cidadao
            LEFT JOIN Agente a ON o.id_agente = a.id_agente
            LEFT JOIN Bairro b ON o.id_bairro = b.id_bairro
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT o.*, c.nome as nome_cidadao, a.nome as nome_agente, b.nome_bairro
            FROM Ocorrencia o
            LEFT JOIN Cidadao c ON o.id_cidadao = c.id_cidadao
            LEFT JOIN Agente a ON o.id_agente = a.id_agente
            LEFT JOIN Bairro b ON o.id_bairro = b.id_bairro
            WHERE o.id_ocorrencia = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    async save() {
        const [result] = await db.query(
            'INSERT INTO Ocorrencia (id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [this.id_cidadao, this.id_agente, this.id_bairro, this.tipo_ocorrencia, this.descricao, this.data_hora, this.status]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status } = data;
        await db.query(
            'UPDATE Ocorrencia SET id_cidadao = ?, id_agente = ?, id_bairro = ?, tipo_ocorrencia = ?, descricao = ?, data_hora = ?, status = ? WHERE id_ocorrencia = ?',
            [id_cidadao, id_agente, id_bairro, tipo_ocorrencia, descricao, data_hora, status, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Ocorrencia WHERE id_ocorrencia = ?', [id]);
    }
}

module.exports = Ocorrencia;
