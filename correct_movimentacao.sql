-- Drop and recreate movimentacao table with exact column names
DROP TABLE IF EXISTS movimentacao;

CREATE TABLE movimentacao (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  "produtoId" INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  data DATE NOT NULL,
  responsavel VARCHAR(255),
  observacao TEXT,
  "dataRegistro" TIMESTAMP DEFAULT NOW()
);

-- Disable Row Level Security
ALTER TABLE movimentacao DISABLE ROW LEVEL SECURITY;
