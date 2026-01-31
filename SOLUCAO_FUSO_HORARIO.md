🔧 **SOLUÇÃO: FUSO HORÁRIO DE SÃO PAULO**

## Melhorias Implementadas:

1. **Formatação Robusta** - A função `formatarDataHoraSP` agora:
   - Converte qualquer formato de data para São Paulo
   - Exibe HH:MM:SS junto com a data
   - Lida corretamente com timestamps UTC
   - Adicionado console.log para debug

2. **Nova Função ISO 8601** - `getCurrentISO8601SP()`:
   - Calcula offset correto de São Paulo
   - Detecta automaticamente horário de verão (-2:00 ou -3:00)

## Como Testar:

1. Recarregue a aplicação (F5)
2. Abra o Console (F12)
3. Faça uma nova movimentação (Adicionar ou Retirar)
4. Vá para Relatórios
5. Verifique no console os logs "DEBUG formatarDataHoraSP"
6. Verifique se a data/hora exibida está correta em São Paulo

## Exemplo do que deve aparecer:

```
DEBUG formatarDataHoraSP: {
  entrada: "2026-01-30T15:30:45.123Z",
  saida: "30/01/2026 12:30:45"
}
```

## Se ainda não funcionar:

Execute este teste no Console do navegador:

```javascript
// Teste o fuso horário
const data = new Date();
const formatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

console.log('Hora em São Paulo:', formatter.format(data));
console.log('Hora local:', data.toLocaleString('pt-BR'));
console.log('Hora UTC:', data.toUTCString());
```

Compare com seu relógio para ver se está correto!
