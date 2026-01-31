-- Add columns to movimentacao table to store user name and registration
ALTER TABLE movimentacao ADD COLUMN IF NOT EXISTS usuario_nome VARCHAR(255);
ALTER TABLE movimentacao ADD COLUMN IF NOT EXISTS usuario_matricula VARCHAR(100);
