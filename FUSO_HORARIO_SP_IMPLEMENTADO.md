✅ **FUSO HORÁRIO DE SÃO PAULO IMPLEMENTADO**

## O que foi alterado:

### 1. Novo arquivo de utilitários de data
**[src/utils/formatters.js](src/utils/formatters.js)** - Adicionadas 5 novas funções:
- `getCurrentDateSP()` - Retorna data atual em SP (formato YYYY-MM-DD)
- `getCurrentDateTimeSP()` - Retorna data/hora em SP (formatada)
- `getCurrentISOSP()` - Retorna ISO string com fuso horário SP
- `formatarDataHoraSP(dataISO)` - Converte qualquer data para formato SP

### 2. Componentes atualizados
- **[src/components/MovimentacaoModal.js](src/components/MovimentacaoModal.js)**
  - Importa `getCurrentDateSP`
  - Usa na data de movimentação

- **[src/pages/EntradasPage.js](src/pages/EntradasPage.js)**
  - Importa `getCurrentDateSP`
  - Usa na data de movimentação de entrada

- **[src/pages/SaidasPage.js](src/pages/SaidasPage.js)**
  - Importa `getCurrentDateSP`
  - Usa na data de movimentação de saída

- **[src/pages/RelatoriosPage.js](src/pages/RelatoriosPage.js)**
  - Importa `formatarDataHoraSP`
  - Usa ao exibir data/hora dos relatórios

## Resultado:

✅ Todas as datas/horas de movimentação agora são salvas com fuso horário de **São Paulo (America/Sao_Paulo)**
✅ Todos os relatórios exibem data/hora em **São Paulo**
✅ Compatível com navegadores modernos (usa Intl.DateTimeFormat)

## Teste:

1. Faça uma nova movimentação (Adicionar ou Retirar)
2. Vá para "Relatórios"
3. Verifique que a data/hora exibida está em São Paulo (considere o horário atual em SP)
