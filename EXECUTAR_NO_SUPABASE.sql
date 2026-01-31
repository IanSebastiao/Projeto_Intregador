-- ✅ SOLUÇÃO: ADICIONAR COLUNAS USUARIO NO BANCO DE DADOS

-- PASSO 1: Execute este SQL NO SUPABASE SQL EDITOR para adicionar as colunas
ALTER TABLE movimentacao 
ADD COLUMN IF NOT EXISTS usuario_nome VARCHAR(255),
ADD COLUMN IF NOT EXISTS usuario_matricula VARCHAR(100);

-- PASSO 2: Verifique se as colunas foram criadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'movimentacao' 
ORDER BY ordinal_position;

-- RESULTADO ESPERADO:
-- id | integer | false
-- tipo | character varying | false
-- produtoid | integer | false
-- quantidade | integer | false
-- data | date | false
-- responsavel | character varying | true
-- usuario | character varying | true
-- usuario_nome | character varying | true     <-- NOVA
-- usuario_matricula | character varying | true  <-- NOVA
-- observacao | text | true
-- dataregistro | timestamp | false

-- PASSO 3: Ver os últimos registros (após adicionar as colunas, refaça uma movimentação)
SELECT id, tipo, responsavel, usuario, usuario_nome, usuario_matricula, dataregistro 
FROM movimentacao 
ORDER BY id DESC 
LIMIT 10;

-- Se tudo estiver funcionando, você verá:
-- id | tipo | responsavel | usuario | usuario_nome | usuario_matricula | dataregistro
-- ... | ... | ... | ... | "Nome do Usuario" | "810703" | ...
