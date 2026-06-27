CREATE DATABASE IF NOT EXISTS `cidadaoseguro-db`;
USE `cidadaoseguro-db`;

CREATE TABLE IF NOT EXISTS Cidadao (
    id_cidadao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS Agente (
    id_agente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    matricula VARCHAR(20) NOT NULL UNIQUE,
    cargo VARCHAR(50),
    turno VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Bairro (
    id_bairro INT AUTO_INCREMENT PRIMARY KEY,
    nome_bairro VARCHAR(100) NOT NULL,
    zona VARCHAR(50),
    populacao_estimada INT,
    observacoes TEXT
);

CREATE TABLE IF NOT EXISTS Ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_cidadao INT,
    id_agente INT,
    id_bairro INT,
    tipo_ocorrencia VARCHAR(50) NOT NULL,
    descricao TEXT,
    data_hora DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    FOREIGN KEY (id_cidadao) REFERENCES Cidadao(id_cidadao) ON DELETE SET NULL,
    FOREIGN KEY (id_agente) REFERENCES Agente(id_agente) ON DELETE SET NULL,
    FOREIGN KEY (id_bairro) REFERENCES Bairro(id_bairro) ON DELETE SET NULL
);
