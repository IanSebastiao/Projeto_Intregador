-- VERIFICAR COMO OS DADOS ESTÃO SENDO SALVOS

-- Ver os últimos registros com data em diferentes formatos
SELECT 
  id,
  tipo,
  responsavel,
  data,
  dataregistro,
  EXTRACT(HOUR FROM dataregistro AT TIME ZONE 'America/Sao_Paulo') as hora_sp,
  EXTRACT(MINUTE FROM dataregistro AT TIME ZONE 'America/Sao_Paulo') as minuto_sp,
  dataregistro AT TIME ZONE 'America/Sao_Paulo' as dataregistro_sp
FROM movimentacao
ORDER BY id DESC
LIMIT 10;

-- Se a coluna 'dataregistro' mostra UTC:
-- Você verá algo como: 2026-01-30 18:30:45+00:00

-- Se você quer converter para São Paulo no SELECT, use:
-- SELECT dataregistro AT TIME ZONE 'America/Sao_Paulo' FROM movimentacao;

-- Para ver no formato legível:
SELECT 
  id,
  TO_CHAR(dataregistro AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI:SS') as data_hora_sp
FROM movimentacao
ORDER BY id DESC
LIMIT 10;
