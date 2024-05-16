-- Criar a database PUCHELP
CREATE DATABASE IF NOT EXISTS PUCHELP;

-- Usar a database PUCHELP
USE PUCHELP;

-- Criação da tabela de tipos de área
CREATE TABLE tipo_area (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE
);

select * from tipo_area ta;

-- Inserção dos tipos de área
INSERT INTO tipo_area (nome) VALUES ('humanas'), ('exatas'), ('biológicas');


CREATE SEQUENCE area_id_seq;


-- Criar tabela area
CREATE TABLE area (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50),
    tipo INT,
    foreign key (tipo) references tipo_area(id)
);

-- Criar tabela curso
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    disciplinas VARCHAR(100),
    idArea INT,
    FOREIGN KEY (idArea) REFERENCES area(id)
);

-- Criar tabela DisciplinasCurso
CREATE TABLE DisciplinasCurso (
    id SERIAL PRIMARY KEY,
    idCurso INT,
    nomeDisciplina VARCHAR(100),
    FOREIGN KEY (idCurso) REFERENCES curso(id)
);

-- Criar tabela professor
CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    materia VARCHAR(100),
    idCurso INT,
    FOREIGN KEY (idCurso) REFERENCES curso(id)
);

-- Criar tabela CursoProfessores
CREATE TABLE CursoProfessores (
    id SERIAL PRIMARY KEY,
    idCurso INT,
    idProfessor INT,
    FOREIGN KEY (idCurso) REFERENCES curso(id),
    FOREIGN KEY (idProfessor) REFERENCES professor(id)
);

-- Criar tabela aluno
CREATE TABLE aluno (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20),
    idCurso INT,
    periodo INT,
    nome VARCHAR(100),
    FOREIGN KEY (idCurso) REFERENCES curso(id)
);

create table tipo_publicacao (
	id SERIAL primary key,
	nome VARCHAR(100)
);

-- Criar tabela publicações
CREATE TABLE publicacoes (
    id SERIAL PRIMARY KEY,
    idTipo INT,
    conteudo TEXT,
    idAluno INT,
    FOREIGN KEY (idAluno) REFERENCES aluno(id),
    FOREIGN KEY (idTipo) REFERENCES tipo_publicacao(id)
);

create table RelacionamentoAlunos (
	id SERIAL primary key,
	idAluno INT,
	idAlunoSeguido INT,
	foreign key (idAluno) references aluno(id),
	foreign key (idAlunoSeguido) references aluno(id)
);

create table tipo_usuario (
 id SERIAL primary key,
 nome VARCHAR(20)
);


create table Usuario (
 id SERIAL primary key,
 cpf VARCHAR(100),
 matricula INT,
 tipo INT,
 idCurso INT,
 periodo INT,
 nome VARCHAR(100),
 foreign key (idCurso) references curso(id)
);

select * from tipo_usuario;


ALTER TABLE usuario 
ADD COLUMN  senha VARCHAR(30);

alter table usuario 
alter column cpf TYPE VARCHAR(100);

select * from usuario ;
select * from area a ;
select * from curso c;

insert into public.curso (d)

select * from usuario u;

insert into tipo_usuario (nome) values ('Administrador');
select * from curso c;


