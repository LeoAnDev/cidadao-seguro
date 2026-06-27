const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const connection = await mysql.createConnection({
            host: '172.24.128.1',
            user: 'root',
            password: 'root',
            multipleStatements: true
        });

        const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf-8');
        await connection.query(sqlScript);
        console.log('Banco de dados inicializado com sucesso.');
        await connection.end();
    } catch (err) {
        console.error('Erro ao inicializar o banco:', err);
    }
}

initDb();
