const db = require('../db');

class Agente {
    constructor(nome, cpf, email, telefone, matricula, cargo, turno) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.matricula = matricula;
        this.cargo = cargo;
        this.turno = turno;
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM Agente');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM Agente WHERE id_agente = ?', [id]);
        return rows[0];
    }

    async save() {
        const [result] = await db.query(
            'INSERT INTO Agente (nome, cpf, email, telefone, matricula, cargo, turno) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [this.nome, this.cpf, this.email, this.telefone, this.matricula, this.cargo, this.turno]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { nome, cpf, email, telefone, matricula, cargo, turno } = data;
        await db.query(
            'UPDATE Agente SET nome = ?, cpf = ?, email = ?, telefone = ?, matricula = ?, cargo = ?, turno = ? WHERE id_agente = ?',
            [nome, cpf, email, telefone, matricula, cargo, turno, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Agente WHERE id_agente = ?', [id]);
    }
}

module.exports = Agente;
