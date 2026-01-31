import { usuarioService } from './usuarioService';
import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'auth_user';

export const authService = {
  async login(email, password) {
    // Buscar usuário por email
    const usuario = await usuarioService.buscarPorEmail(email);
    
    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    // Remover senha do objeto antes de retornar
    const { senha, ...usuarioSemSenha } = usuario;

    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioSemSenha));

    return {
      user: usuarioSemSenha,
      session: { user: usuarioSemSenha }
    };
  },

  async register(usuarioData) {
    // Verificar se email já existe
    const usuarioExistente = await usuarioService.buscarPorEmail(usuarioData.email);
    
    if (usuarioExistente) {
      throw new Error('Este email já está cadastrado');
    }

    // Criar usuário com perfil "Comum" (idperfil = 2)
    const novoUsuario = await usuarioService.cadastrar({
      ...usuarioData,
      idperfil: 2 // Perfil "Comum"
    });

    // Remover senha do objeto
    const { senha, ...usuarioSemSenha } = novoUsuario;

    return {
      user: usuarioSemSenha,
      session: { user: usuarioSemSenha }
    };
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Erro ao parsear usuário do localStorage:', error);
      return null;
    }
  },

  onAuthStateChange(callback) {
    // Implementação simplificada para compatibilidade
    // Chama o callback imediatamente com o usuário atual
    const user = this.getCurrentUser();
    callback('SIGNED_IN', { user });

    // Retorna um objeto com unsubscribe vazio para compatibilidade
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  },
};
