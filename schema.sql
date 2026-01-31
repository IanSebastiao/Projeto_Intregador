-- Schema for controle-material database

-- Table: tipos
CREATE TABLE tipos (
  idtipo SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL
);

-- Table: fornecedor
CREATE TABLE fornecedor (
  idfornecedor SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  contato VARCHAR(255),
  endereco TEXT,
  telefone VARCHAR(50)
);

-- Table: produtos
CREATE TABLE produtos (
  idproduto SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(100),
  quantidade INTEGER DEFAULT 0,
  validade DATE,
  local VARCHAR(255),
  idtipo INTEGER,
  idfornecedor INTEGER
);

-- Table: perfil
CREATE TABLE perfil (
  idperfil SERIAL PRIMARY KEY,
  perfil VARCHAR(100) NOT NULL
);

-- Table: usuario
CREATE TABLE usuario (
  idusuario SERIAL PRIMARY KEY,
  matricula VARCHAR(100),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  idperfil INTEGER
);

-- Table: movimentacoes
CREATE TABLE movimentacoes (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  produtoId INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  data DATE NOT NULL,
  responsavel VARCHAR(255),
  usuario VARCHAR(255),
  usuario_nome VARCHAR(255),
  usuario_matricula VARCHAR(100),
  observacao TEXT,
  dataRegistro TIMESTAMP DEFAULT NOW()
);

-- Insert initial data
INSERT INTO tipos (tipo) VALUES ('Perecível'), ('Não perecível'), ('Outros');

INSERT INTO perfil (perfil) VALUES ('Administrador'), ('Comum');
