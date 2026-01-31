# Plano de Implementação - Sistema de Autenticação com Banco de Dados

## Informações Coletadas

### Estrutura das Tabelas
- **usuario**: idusuario (PK), matricula, nome, telefone, email, senha (hash), idperfil (FK)
- **perfil**: idperfil (PK), perfil (varchar)

### Requisitos
1. Senha deve ser criptografada (hash)
2. Todos os novos usuários começam como "Comum"
3. Alteração de perfil: apenas no banco de dados ou via login de administrador
4. Diferenças de tela serão configuradas posteriormente

## Plano de Implementação

### 1. Instalar Dependência para Criptografia
- [ ] Instalar `bcryptjs` para hash de senhas

### 2. Criar Serviço de Perfil
- [ ] Criar `src/services/perfilService.js`
  - Função para listar perfis
  - Função para buscar perfil por ID

### 3. Atualizar Serviço de Autenticação
- [ ] Modificar `src/services/authService.js`
  - **login**: Buscar usuário por email na tabela `usuario`, verificar senha com bcrypt, retornar usuário com perfil
  - **register**: Inserir novo usuário na tabela `usuario` com senha hash e idperfil = 2 (Comum)
  - **getCurrentUser**: Buscar usuário atual do localStorage/sessionStorage
  - Remover uso de Supabase Auth (signInWithPassword, signUp, etc)

### 4. Atualizar Serviço de Usuário
- [ ] Modificar `src/services/usuarioService.js`
  - Mudar TABLE de 'users' para 'usuario'
  - Adicionar função `buscarPorEmail(email)`
  - Adicionar join com tabela `perfil` nas consultas
  - Atualizar função `cadastrar` para aceitar senha e fazer hash

### 5. Atualizar Contexto de Autenticação
- [ ] Modificar `src/contexts/AuthContext.js`
  - Adicionar campo `perfil` ao estado do usuário
  - Modificar `login` para armazenar usuário e perfil no localStorage
  - Modificar `register` para criar usuário com perfil "Comum"
  - Atualizar `getCurrentUser` para ler do localStorage
  - Remover dependência de Supabase Auth

### 6. Atualizar Página de Login
- [ ] Modificar `src/pages/LoginPage.js`
  - Manter interface atual
  - Atualizar mensagens de erro conforme necessário

### 7. Atualizar Página de Registro
- [ ] Modificar `src/pages/RegisterPage.js`
  - Adicionar campos: matricula, nome, telefone
  - Remover lógica de confirmação de email
  - Criar usuário com perfil "Comum" por padrão

### 8. Criar Tabelas no Supabase (se necessário)
- [ ] Verificar se as tabelas `usuario` e `perfil` existem
- [ ] Criar/atualizar tabelas conforme necessário
- [ ] Inserir perfis padrão: 1-Administrador, 2-Comum

### 9. Atualizar Componentes de Usuário
- [ ] Modificar `src/components/CadastroUsuario.js` para usar nova estrutura
- [ ] Modificar `src/components/EditarUsuario.js` para incluir perfil
- [ ] Atualizar `src/pages/ConsultaUsuariosPage.js` para mostrar perfil

### 10. Testes
- [ ] Testar registro de novo usuário
- [ ] Testar login com credenciais corretas
- [ ] Testar login com credenciais incorretas
- [ ] Verificar se perfil é armazenado corretamente
- [ ] Testar logout

## Arquivos a Serem Modificados

1. `package.json` - adicionar bcryptjs
2. `src/services/perfilService.js` - CRIAR NOVO
3. `src/services/authService.js` - MODIFICAR
4. `src/services/usuarioService.js` - MODIFICAR
5. `src/contexts/AuthContext.js` - MODIFICAR
6. `src/pages/LoginPage.js` - MODIFICAR
7. `src/pages/RegisterPage.js` - MODIFICAR
8. `src/components/CadastroUsuario.js` - MODIFICAR
9. `src/components/EditarUsuario.js` - MODIFICAR
10. `src/pages/ConsultaUsuariosPage.js` - MODIFICAR

## Observações Importantes

- A senha NUNCA deve ser armazenada em texto simples
- Usar bcrypt com salt rounds = 10
- Armazenar token/sessão no localStorage
- Validar email único no registro
- Adicionar validação de campos obrigatórios
