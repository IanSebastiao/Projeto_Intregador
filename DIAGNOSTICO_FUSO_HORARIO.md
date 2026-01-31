**DIAGNÓSTICO: FUSO HORÁRIO NÃO ESTÁ FUNCIONANDO**

## Verifique no Console (F12):

1. Abra o navegador
2. Pressione F12 para abrir o Console
3. Vá para a página de Relatórios
4. Procure pelos logs com "DEBUG - Movimento individual"
5. Verifique:
   - `dataregistro`: como está sendo armazenado no banco
   - `dataFormatada`: como está sendo exibido
   - Compare com a hora do seu relógio (deve estar em São Paulo)

## Possíveis Problemas:

### Problema 1: Data vem como texto (YYYY-MM-DD) sem hora
- Esperado: "2026-01-30"
- O `formatarDataHoraSP` não consegue extrair hora/minuto
- **Solução**: Precisamos também salvar a hora no banco

### Problema 2: Data vem como timestamp UTC
- Esperado: "2026-01-30T15:30:45.123Z"
- O `formatarDataHoraSP` já trata isso
- Verifique se está exibindo corretamente em SP

### Problema 3: Horário não corresponde a São Paulo
- Se a hora exibida não bate com o seu relógio em São Paulo
- Pode ser que o `Intl.DateTimeFormat` não esteja funcionando corretamente no seu navegador

## O que fazer:

1. Abra o console
2. Cole isto e execute:
```javascript
// Teste a função
const now = new Date();
console.log('Hora UTC:', now);

const formatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
console.log('Hora em São Paulo:', formatter.format(now));
console.log('Hora local do navegador:', now.toLocaleString('pt-BR'));
```

3. Compartilhe os resultados para diagnóstico completo
