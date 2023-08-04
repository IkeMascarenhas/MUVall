CREATE DATABASE MUVALL

USE MUVALL

CREATE TABLE cadastro (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(100000) NOT NULL,
  dataNasc DATE not null,
  PRIMARY KEY (id)
);





INSERT INTO cadastro (nome, email, senha) VALUES
('Pietro', 'pietro@example.com', 'senha2141'),
('Richard','pistili@example.com', 'senha4321'),
('Felipe', 'Neres@example.com', 'senh1234');

SELECT * FROM CADASTRO


CREATE TABLE cadastro_anunciante (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nomeDaEmpresa VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(50) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  fotoPerfil VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO cadastro_anunciante (nomeDaEmpresa, email, senha, cnpj, localizacao) 
VALUES ('Empresa XPTO', 'empresa@exemplo.com', 'senha123', '12345678901234', 'Rua Principal, 123');

SELECT * FROM cadastro_anunciante










