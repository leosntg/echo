CREATE DATABASE IF NOT EXISTS Echo;

USE Echo;

CREATE TABLE Curso (
id INT PRIMARY KEY AUTO_INCREMENT,
nome_curso VARCHAR(255) NOT NULL
);

CREATE TABLE Usuario (
id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(255) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL,
tipo INT NOT NULL,
biografia TEXT(500),
id_curso INT,
foto_perfil VARCHAR(255),
nome VARCHAR(255) NOT NULL,
data_criacao DATE,
FOREIGN KEY (id_curso) REFERENCES Curso(id)
);

CREATE TABLE Postagem (
id INT PRIMARY KEY AUTO_INCREMENT,
conteudo TEXT(500) NOT NULL,
id_autor INT NOT NULL,
data_criacao DATE,
FOREIGN KEY (id_autor) REFERENCES Usuario(id)
);

CREATE TABLE Comentario (
id INT PRIMARY KEY AUTO_INCREMENT,
conteudo TEXT(500) NOT NULL,
id_autor INT NOT NULL,
id_postagem INT NOT NULL,
data_criacao DATE,
FOREIGN KEY (id_autor) REFERENCES Usuario(id),
FOREIGN KEY (id_postagem) REFERENCES Postagem(id)
);

CREATE TABLE Curtida (
id INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
id_postagem INT,
id_comentario INT,
data_criacao DATE,
FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
FOREIGN KEY (id_postagem) REFERENCES Postagem(id),
FOREIGN KEY (id_comentario) REFERENCES Comentario(id)
);

INSERT INTO Curso (nome_curso) VALUES ('Sistemas de Informação');

INSERT INTO Curso (nome_curso) VALUES ('Engenharia de Produção');

INSERT INTO Usuario (email, senha, tipo, biografia, id_curso, foto_perfil, nome, data_criacao)
VALUES ('email1@email.com', 'senha123', 1, 'Estudante de Sistemas de Informação', 1, 'foto1.jpg', 'João Silva', '2024-01-01');

INSERT INTO Usuario (email, senha, tipo, biografia, id_curso, foto_perfil, nome, data_criacao)
VALUES ('email2@example.com', 'senha123', 2, 'Apaixonada por engenharia', 2, 'foto2.jpg', 'Maria Oliveira', '2024-01-02');

INSERT INTO Postagem (conteudo, id_autor, data_criacao)
VALUES ('Minha primeira postagem!', 1, '2024-02-01');

INSERT INTO Postagem (conteudo, id_autor, data_criacao)
VALUES ('Postagem sobre computação!', 2, '2024-02-02');

INSERT INTO Comentario (conteudo, id_autor, id_postagem, data_criacao)
VALUES ('Parabéns pela postagem!', 2, 1, '2024-02-03');

INSERT INTO Comentario (conteudo, id_autor, id_postagem, data_criacao)
VALUES ('Muito interessante!', 1, 2, '2024-02-04');

INSERT INTO Curtida (id_usuario, id_postagem, data_criacao)
VALUES (1, 2, '2024-02-05');

INSERT INTO Curtida (id_usuario, id_comentario, data_criacao)
VALUES (2, 1, '2024-02-06');