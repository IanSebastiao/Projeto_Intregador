-- Drop and recreate movimentacao table with lowercase column names
DROP TABLE IF EXISTS movimentacao;

CREATE TABLE movimentacao (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  produtoid INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  data DATE NOT NULL,
  responsavel VARCHAR(255),
  observacao TEXT,
  dataregistro TIMESTAMP DEFAULT NOW()
);

-- Disable Row Level Security
ALTER TABLE movimentacao DISABLE ROW LEVEL SECURITY;
