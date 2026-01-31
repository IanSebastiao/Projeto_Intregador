# Instrução: Adicionar Coluna de Usuário na Tabela de Movimentação

## Status Atual
- ✅ O código está pronto para salvar o nome do usuário
- ✅ A página de relatórios está pronta para exibir o usuário
- ❌ A coluna `usuario` ainda não existe na tabela `movimentacao`

## Ação Necessária

Execute o seguinte comando **no Supabase SQL Editor** (https://app.supabase.com):

```sql
ALTER TABLE movimentacao
ADD COLUMN IF NOT EXISTS usuario VARCHAR(255);
```

**OU**, se estiver usando PostgreSQL diretamente:

```sql
ALTER TABLE movimentacao
ADD COLUMN usuario VARCHAR(255);
```

### Passos:
1. Abra o painel do Supabase
2. Vá para **SQL Editor**
3. Cole o comando acima
4. Clique em **Run**

## Após Executar o SQL

As futuras movimentações registrarão automaticamente o nome do usuário logado que realizou a ação.

### Campos que serão salvos:
- **usuario**: Nome do usuário que realizou a movimentação
- **responsavel**: Pessoa responsável pela movimentação (campo manual)
- **dataregistro**: Data/hora quando foi registrada

## Visualizar os Dados

Acesse a página de **Relatórios** → Coluna **"Usuário"** mostrará quem fez cada movimentação.

---

**Nota**: Se você tem movimentações antigas (antes desta atualização), elas não terão o campo `usuario` preenchido. Apenas as novas movimentações terão o registro do usuário.
