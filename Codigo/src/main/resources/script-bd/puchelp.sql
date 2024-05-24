-- DROP SCHEMA public;
CREATE SCHEMA public AUTHORIZATION postgres;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.area_id_seq;
CREATE SEQUENCE public.area_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.area_id_seq1;
CREATE SEQUENCE public.area_id_seq1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.curso_id_seq;
CREATE SEQUENCE public.curso_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.disciplinascurso_id_seq;
CREATE SEQUENCE public.disciplinascurso_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.publicacoes_id_seq;
CREATE SEQUENCE public.publicacoes_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.tipo_usuario_id_seq;
CREATE SEQUENCE public.tipo_usuario_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- DROP SEQUENCE public.usuario_id_seq;
CREATE SEQUENCE public.usuario_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- public.area definition
-- DROP TABLE public.area;
CREATE TABLE public.area (
    id serial4 NOT NULL,
    nome varchar(50) NULL,
    CONSTRAINT area_pkey PRIMARY KEY (id)
);

-- public.tipo_usuario definition
-- DROP TABLE public.tipo_usuario;
CREATE TABLE public.tipo_usuario (
    id serial4 NOT NULL,
    nome varchar(20) NULL,
    CONSTRAINT tipo_usuario_pkey PRIMARY KEY (id)
);

-- public.curso definition
-- DROP TABLE public.curso;
CREATE TABLE public.curso (
    id serial4 NOT NULL,
    idarea int4 NULL,
    nome varchar(100) NULL,
    CONSTRAINT curso_pkey PRIMARY KEY (id),
    CONSTRAINT curso_idarea_fkey FOREIGN KEY (idarea) REFERENCES public.area(id)
);

-- public.disciplinascurso definition
-- DROP TABLE public.disciplinascurso;
CREATE TABLE public.disciplinascurso (
    id serial4 NOT NULL,
    idcurso int4 NULL,
    nomedisciplina varchar(100) NULL,
    CONSTRAINT disciplinascurso_pkey PRIMARY KEY (id),
    CONSTRAINT disciplinascurso_idcurso_fkey FOREIGN KEY (idcurso) REFERENCES public.curso(id)
);

-- public.usuario definition
-- DROP TABLE public.usuario;
CREATE TABLE public.usuario (
    id serial4 NOT NULL,
    cpf varchar(100) NULL,
    matricula int4 NULL,
    tipo int4 NULL,
    idcurso int4 NULL,
    periodo int4 NULL,
    nome varchar(100) NULL,
    senha varchar(30) NULL,
    email varchar(100) NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id),
    CONSTRAINT fk_tipo_usuario FOREIGN KEY (tipo) REFERENCES public.tipo_usuario(id),
    CONSTRAINT usuario_idcurso_fkey FOREIGN KEY (idcurso) REFERENCES public.curso(id)
);

-- public.publicacoes definition
-- DROP TABLE public.publicacoes;
CREATE TABLE public.publicacoes (
    id serial4 NOT NULL,
    tipo varchar(100) NULL,
    conteudo text NULL,
    idaluno int4 NULL,
    likes int4 NULL,
    coments text NULL,
    CONSTRAINT publicacoes_pkey PRIMARY KEY (id),
    CONSTRAINT publicacoes_idaluno_fkey FOREIGN KEY (idaluno) REFERENCES public.usuario(id)
);

-- Inserir dados na tabela area
INSERT INTO public.area (nome) VALUES 
('Humanas'), 
('Exatas'), 
('Biológicas'), 
('Artes');

-- Inserir dados na tabela curso
INSERT INTO public.curso (idarea, nome) VALUES 
(1, 'Administração'),
(2, 'ADS'),
(1, 'Arquitetura e Urbanismo'),
(3, 'Biomedicina'),
(2, 'Ciência da Computação'),
(2, 'Ciência de Dados'),
(3, 'Ciências Biológicas'),
(2, 'Ciências Contábeis'),
(1, 'Ciências Sociais'),
(4, 'Cinema'),
(1, 'Comércio Exterior'),
(2, 'Construção de Edifícios'),
(1, 'Direito'),
(3, 'Educação Física'),
(3, 'Enfermagem'),
(2, 'Engenharia Aeronáutica'),
(2, 'Engenharia Civil'),
(2, 'Engenharia de Computação'),
(2, 'Engenharia de Controle e Automação'),
(2, 'Engenharia de Energia'),
(2, 'Engenharia de Produção'),
(2, 'Engenharia de Software'),
(2, 'Engenharia Elétrica'),
(2, 'Engenharia Eletrônica e de Telecomunicação'),
(2, 'Engenharia Mecânica'),
(2, 'Engenharia Mecatrônica'),
(2, 'Engenharia Metalúrgica'),
(2, 'Engenharia Química'),
(3, 'Farmácia'),
(1, 'Filosofia'),
(2, 'Física'),
(3, 'Fisioterapia'),
(3, 'Fonoaudiologia'),
(1, 'Geografia'),
(1, 'História'),
(4, 'Jogos Digitais'),
(1, 'Jornalismo'),
(1, 'Letras'),
(1, 'Logística'),
(1, 'Marketing'),
(2, 'Matemática'),
(3, 'Medicina'),
(3, 'Medicina Veterinária'),
(3, 'Nutrição'),
(3, 'Odontologia'),
(1, 'Pedagogia'),
(1, 'Psicologia'),
(1, 'Publicidade e Propaganda'),
(1, 'Relações Internacionais'),
(1, 'Relações Públicas'),
(2, 'Segurança da Informação'),
(1, 'Serviço Social'),
(2, 'Sistemas de Informação'),
(2, 'Sistemas para Internet'),
(1, 'Teologia');

-- Inserir dados na tabela tipo_usuario
INSERT INTO public.tipo_usuario (nome) VALUES 
('Administrador'), 
('Aluno'), 
('Professor');

-- Inserir dados na tabela usuario
INSERT INTO public.usuario (cpf, matricula, tipo, idcurso, periodo, nome, senha, email) VALUES
('12345678900', 1001, 1, 1, 1, 'Admin User', 'admin123', 'admin@example.com'),
('98765432100', 1002, 2, 2, 2, 'Aluno User', 'aluno123', 'aluno@example.com'),
('45678912300', 1003, 3, 3, 3, 'Professor User', 'prof123', 'professor@example.com');

-- Inserir dados na tabela publicacoes
INSERT INTO public.publicacoes (tipo, conteudo, idaluno, likes, coments) VALUES
('Artigo', 'Conteúdo do artigo 1', 2, 10, 'Muito bom!'),
('Artigo', 'Conteúdo do artigo 2', 2, 20, 'Excelente!'),
('Artigo', 'Conteúdo do artigo 3', 2, 30, 'Interessante!');
