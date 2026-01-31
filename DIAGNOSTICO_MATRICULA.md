**DIAGNÓSTICO DE MATRÍCULA NÃO EXIBIDA**

Para diagnosticar o problema, siga os passos abaixo:

## 1. Verificar o Console do Navegador
- Abra o navegador (F12)
- Vá para a aba "Console"
- Faça uma movimentação (Adicionar ou Retirar produto)
- Procure por mensagens com "DEBUG" que incluem:
  - "DEBUG - Usuário logado:" → verifique se existe campo `matricula`
  - "DEBUG movimentacaoService - Dados a inserir:" → verifique se `usuario_matricula` está sendo enviado

## 2. Verificar Banco de Dados (Supabase)
Execute este SQL no Supabase SQL Editor para verificar a estrutura:

```sql
-- Verificar se as colunas existem
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'movimentacao' 
ORDER BY ordinal_position;

-- Ver os últimos registros
SELECT id, usuario_nome, usuario_matricula, usuario, dataregistro 
FROM movimentacao 
ORDER BY id DESC 
LIMIT 10;
```

## 3. Soluções Possíveis

### Opção A: Se as colunas não existem no banco
Execute este SQL no Supabase:
```sql
ALTER TABLE movimentacao ADD COLUMN IF NOT EXISTS usuario_nome VARCHAR(255);
ALTER TABLE movimentacao ADD COLUMN IF NOT EXISTS usuario_matricula VARCHAR(100);
```

### Opção B: Se o usuário não tem matrícula
Verifique a tabela `usuario` para confirmar que há matrícula cadastrada:
```sql
SELECT idusuario, nome, email, matricula FROM usuario;
```

Se não houver matrícula, atualize:
```sql
UPDATE usuario SET matricula = 'MAT001' WHERE idusuario = 1;
```

## 4. Próximos Passos
1. Abra o console e refaça uma movimentação
2. Compartilhe o conteúdo dos logs "DEBUG" que aparecerão
3. Execute o SQL de diagnóstico no Supabase e verifique os resultados
