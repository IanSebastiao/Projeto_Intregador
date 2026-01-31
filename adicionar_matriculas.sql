-- Script para adicionar matrículas aos usuários existentes
-- Execute isto no Supabase SQL Editor

-- Verificar usuários sem matrícula
SELECT idusuario, nome, email, matricula FROM usuario WHERE matricula IS NULL OR matricula = '';

-- Adicionar matrículas (ajuste conforme necessário)
UPDATE usuario SET matricula = 'ADM001' WHERE nome LIKE '%admin%' OR nome LIKE '%administrador%';
UPDATE usuario SET matricula = 'USR001' WHERE matricula IS NULL LIMIT 1;
UPDATE usuario SET matricula = 'USR002' WHERE matricula IS NULL LIMIT 1;
UPDATE usuario SET matricula = 'USR003' WHERE matricula IS NULL LIMIT 1;

-- Ou adicionar manualmente para cada usuário:
-- UPDATE usuario SET matricula = 'MAT_AQUI' WHERE idusuario = ID_DO_USUARIO;

-- Verificar resultado
SELECT idusuario, nome, email, matricula FROM usuario;
