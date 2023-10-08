CREATE DATABASE MUVALL;

use MUVALL;

select * from tipo_usuario;

CREATE TABLE usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nome_usuario VARCHAR(50) NOT NULL,
  email_usuario VARCHAR(50) NOT NULL,
  senha_usuario VARCHAR(100) NOT NULL,
  dataNasc_usuario varchar(40) not null,
  status_usuario int DEFAULT '1',
  PRIMARY KEY (id_usuario)
);


INSERT INTO usuario (nome, email, senha) VALUES
('Pietro', 'pietro@example.com', 'senha123'),
('Richard','pistili@example.com', 'senha321'),
('Felipe', 'neres@example.com', 'senha132');

SELECT * FROM usuario;


CREATE table usuario_anunciante (
  id_anunciante INT NOT NULL AUTO_INCREMENT,
  nomeDaEmpresa VARCHAR(50) NOT NULL,
  email_anunciante VARCHAR(50) NOT NULL,
  senha_anunciante VARCHAR(50) NOT NULL,
  cnpj_anunciante VARCHAR(14) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO cadastro_anunciante (nomeDaEmpresa, email, senha, cnpj) 
VALUES ('Empresa XPTO', 'empresa@exemplo.com', 'senha123', '12345678901234');

SELECT * FROM usuario_anunciante;

CREATE TABLE anuncio (
  id INT not null auto_increment,
  nome_anuncio varchar(50) not null,
  descricao varchar(200),
  preco float not null,
  veiculo varchar(30) not null,
  placa_veiculo varchar(7) not null,
  capacidade varchar(30) not null,
  regiao varchar(50) not null,
  telefone_contato varchar(13) not null,
  email_contato varchar(100) not null,
  PRIMARY KEY (id)
);


DROP database muvall;