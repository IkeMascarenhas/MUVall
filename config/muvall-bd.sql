

CREATE DATABASE MUVALL


CREATE TABLE cadastro (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE cadastro
ADD COLUMN data_nascimento DATE;

UPDATE cadastro
SET data_nascimento = '1990-05-15'
WHERE id = 1;

INSERT INTO cadastro (nome, email, senha) VALUES
('Pietro Gostoso', 'pietro@example.com', 'senha2131'),
('Richar Preto Viado','macaco.pistili@example.com', '2312312ds'),
('Felipe Gosta de Negão', 'Neres.viado@example.com', 'senh12312a789');

SELECT * FROM CADASTRO

--------------------------------------------------------------------------



CREATE TABLE cadastro_anunciante (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nomeDaEmpresa VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(50) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  localizacao VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO cadastro_anunciante (nomeDaEmpresa, email, senha, cnpj, localizacao) 
VALUES ('Empresa XPTO', 'empresa@exemplo.com', 'senha123', '12345678901234', 'Rua Principal, 123');

SELECT * FROM cadastro_anunciante

CREATE TABLE login_usuarios(
  id INT(11) NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
select * from login_usuarios

insert into login_usuarios(email,senha) values ('pietro.silva@gmail.com','slql23123');







