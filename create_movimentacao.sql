-- Create movimentacao table if it doesn't exist
CREATE TABLE IF NOT EXISTS movimentacao (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  produtoId INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  data DATE NOT NULL,
  responsavel VARCHAR(255),
  observacao TEXT,
  dataRegistro TIMESTAMP DEFAULT NOW()
);

-- Disable Row Level Security for movimentacao table
ALTER TABLE movimentacao DISABLE ROW LEVEL SECURITY;
