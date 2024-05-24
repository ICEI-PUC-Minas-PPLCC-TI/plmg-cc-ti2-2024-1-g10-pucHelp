-- Primeiro, crie o banco de dados
CREATE DATABASE puchelp;

-- Depois, conecte-se ao banco de dados criado
\connect puchelp;

-- Agora, o restante do script pode ser executado no contexto do novo banco de dados
CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres;

CREATE SEQUENCE IF NOT EXISTS public.aluno_id_seq
    NO MINVALUE
    NO MAXVALUE;

CREATE SEQUENCE IF NOT EXISTS public.area_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.area_id_seq1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.curso_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.disciplinascurso_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.publicacoes_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.tipo_usuario_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS public.usuario_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE TABLE IF NOT EXISTS public.area (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.tipo_usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS public.curso (
    id SERIAL PRIMARY KEY,
    idarea INT REFERENCES public.area(id),
    nome VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.disciplinascurso (
    id SERIAL PRIMARY KEY,
    idcurso INT REFERENCES public.curso(id),
    nomedisciplina VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(100),
    matricula INT,
    tipo INT REFERENCES public.tipo_usuario(id),
    idcurso INT REFERENCES public.curso(id),
    periodo INT,
    nome VARCHAR(100),
    senha VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS public.aluno (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20),
    idcurso INT REFERENCES public.curso(id),
    periodo INT,
    nome VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.publicacoes (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100),
    conteudo TEXT,
    idaluno INT REFERENCES public.usuario(id),
    likes INT,
    coments TEXT
);


-- Inserindo áreas
INSERT INTO public.area (nome) VALUES ('Engenharia'), ('Medicina'), ('Direito');

-- Inserindo tipos de usuários
INSERT INTO public.tipo_usuario (nome) VALUES ('Administrador'), ('Aluno'), ('Professor');

-- Inserindo cursos
INSERT INTO public.curso (idarea, nome) VALUES (1, 'Engenharia Civil'), (1, 'Engenharia de Software'), (2, 'Medicina Geral'), (3, 'Direito Penal');

-- Inserindo disciplinas
INSERT INTO public.disciplinascurso (idcurso, nomedisciplina) VALUES (1, 'Cálculo I'), (2, 'Programação I'), (3, 'Anatomia'), (4, 'Direito Constitucional');

-- Inserindo usuários
INSERT INTO public.usuario (cpf, matricula, tipo, idcurso, periodo, nome, senha) VALUES
('123.456.789-00', 1001, 1, 1, 1, 'Admin User', 'admin123'),
('987.654.321-00', 1002, 2, 2, 2, 'Aluno User', 'aluno123'),
('456.789.123-00', 1003, 3, 3, 3, 'Professor User', 'prof123');

-- Inserindo publicações
INSERT INTO public.publicacoes (tipo, conteudo, idaluno, likes, coments) VALUES
('Artigo', 'Conteúdo do artigo 1', 2, 10, 'Muito bom!'),
('Artigo', 'Conteúdo do artigo 2', 2, 20, 'Excelente!'),
('Artigo', 'Conteúdo do artigo 3', 2, 30, 'Interessante!');
