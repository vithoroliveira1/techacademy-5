CREATE DATABASE IF NOT EXISTS car_system;
USE car_system;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    role ENUM('developer', 'lead') NOT NULL DEFAULT 'lead'
);

CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    pais_origem VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS carros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    cor VARCHAR(100) NOT NULL,
    marca_id INT NOT NULL,
    status ENUM('disponivel', 'alugado') NOT NULL DEFAULT 'disponivel',
    FOREIGN KEY (marca_id) REFERENCES marcas(id)
);

CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carro_id INT NOT NULL,
    comprador_nome VARCHAR(255) NOT NULL,
    comprador_cpf VARCHAR(14) NOT NULL,
    valor_venda DECIMAL(10, 2) NOT NULL,
    data_venda DATE NOT NULL,
    FOREIGN KEY (carro_id) REFERENCES carros(id)
);

CREATE TABLE IF NOT EXISTS alugueis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carro_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status ENUM('ativo', 'finalizado', 'cancelado') NOT NULL DEFAULT 'ativo',
    FOREIGN KEY (carro_id) REFERENCES carros(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Migration para bancos existentes (execute manualmente se o banco já existe):
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role ENUM('developer', 'lead') NOT NULL DEFAULT 'lead';
-- ALTER TABLE carros ADD COLUMN IF NOT EXISTS status ENUM('disponivel', 'alugado') NOT NULL DEFAULT 'disponivel';
