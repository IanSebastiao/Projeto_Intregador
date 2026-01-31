-- Verificar estrutura da tabela movimentacao
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'movimentacao' 
ORDER BY ordinal_position;

-- Ver as últimas movimentações com todos os campos
SELECT * FROM movimentacao ORDER BY id DESC LIMIT 5;
