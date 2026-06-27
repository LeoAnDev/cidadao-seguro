const db = require('../db');

class Cidadao {
    constructor(nome, cpf, email, telefone, endereco, data_nascimento) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
        this.data_nascimento = data_nascimento;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM Cidadao');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM Cidadao WHERE id_cidadao = ?', [id]);
        return rows[0];
    }

    async save() {
        const [result] = await db.query(
            'INSERT INTO Cidadao (nome, cpf, email, telefone, endereco, data_nascimento) VALUES (?, ?, ?, ?, ?, ?)',
            [this.nome, this.cpf, this.email, this.telefone, this.endereco, this.data_nascimento]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { nome, cpf, email, telefone, endereco, data_nascimento } = data;
        await db.query(
            'UPDATE Cidadao SET nome = ?, cpf = ?, email = ?, telefone = ?, endereco = ?, data_nascimento = ? WHERE id_cidadao = ?',
            [nome, cpf, email, telefone, endereco, data_nascimento, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Cidadao WHERE id_cidadao = ?', [id]);
    }
}

module.exports = Cidadao;
