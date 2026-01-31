-- Adicionar coluna de usuario à tabela movimentacao (apenas se não existir)
-- Execute este script no Supabase SQL Editor para adicionar o campo

-- Para PostgreSQL/Supabase:
ALTER TABLE movimentacao
ADD COLUMN IF NOT EXISTS usuario VARCHAR(255);

-- Opcional: Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_movimentacao_usuario ON movimentacao(usuario);
