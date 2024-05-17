-- Criação da tabela area
CREATE TABLE IF NOT EXISTS area (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50)
);

-- Criação da tabela tipo_usuario
CREATE TABLE IF NOT EXISTS tipo_usuario (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(20)
);

-- Criação da tabela curso
CREATE TABLE IF NOT EXISTS curso (
	id SERIAL PRIMARY KEY,
	idarea INTEGER REFERENCES area(id),
	nome VARCHAR(100)
);

-- Criação da tabela disciplinascurso
CREATE TABLE IF NOT EXISTS disciplinascurso (
	id SERIAL PRIMARY KEY,
	idcurso INTEGER REFERENCES curso(id),
	nomedisciplina VARCHAR(100)
);

-- Criação da tabela usuario
CREATE TABLE IF NOT EXISTS usuario (
	id SERIAL PRIMARY KEY,
	cpf VARCHAR(100),
	matricula INTEGER,
	tipo INTEGER REFERENCES tipo_usuario(id),
	idcurso INTEGER REFERENCES curso(id),
	periodo INTEGER,
	nome VARCHAR(100),
	senha VARCHAR(30)
);

-- Criação da tabela aluno
CREATE TABLE IF NOT EXISTS aluno (
	id SERIAL PRIMARY KEY,
	matricula VARCHAR(20),
	idcurso INTEGER REFERENCES curso(id),
	periodo INTEGER,
	nome VARCHAR(100)
);

-- Criação da tabela publicacoes
CREATE TABLE IF NOT EXISTS publicacoes (
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(100),
	conteudo TEXT,
	idaluno INTEGER REFERENCES usuario(id),
	likes INTEGER,
	coments TEXT
);


-- Adiciona a chave estrangeira na tabela curso
ALTER TABLE curso
ADD CONSTRAINT fk_curso_area
FOREIGN KEY (idarea) REFERENCES area(id);

-- Adiciona a chave estrangeira na tabela disciplinascurso
ALTER TABLE disciplinascurso
ADD CONSTRAINT fk_disciplinascurso_curso
FOREIGN KEY (idcurso) REFERENCES curso(id);

-- Adiciona a chave estrangeira na tabela usuario
ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_tipo_usuario
FOREIGN KEY (tipo) REFERENCES tipo_usuario(id);

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_curso
FOREIGN KEY (idcurso) REFERENCES curso(id);

-- Adiciona a chave estrangeira na tabela aluno
ALTER TABLE aluno
ADD CONSTRAINT fk_aluno_curso
FOREIGN KEY (idcurso) REFERENCES curso(id);

-- Adiciona a chave estrangeira na tabela publicacoes
ALTER TABLE publicacoes
ADD CONSTRAINT fk_publicacoes_usuario
FOREIGN KEY (idaluno) REFERENCES usuario(id);
