import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const TABLE = 'usuario';

export const usuarioService = {
  async cadastrar(usuarioData) {
    // Hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(usuarioData.senha, 10);
    
    const { data, error } = await supabase
      .from(TABLE)
      .insert([{
        ...usuarioData,
        senha: senhaHash
      }])
      .select(`
        *,
        perfil:idperfil (
          idperfil,
          perfil
        )
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async listar() {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        perfil:idperfil (
          idperfil,
          perfil
        )
      `)
      .order('idusuario', { ascending: false });
    if (error) throw error;
    return data;
  },

  async buscarPorId(idusuario) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        perfil:idperfil (
          idperfil,
          perfil
        )
      `)
      .eq('idusuario', idusuario)
      .single();
    if (error) throw error;
    return data;
  },

  async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        perfil:idperfil (
          idperfil,
          perfil
        )
      `)
      .eq('email', email)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Usuário não encontrado
      }
      throw error;
    }
    return data;
  },

  async atualizar(idusuario, usuarioData) {
    // Se houver senha, fazer hash
    if (usuarioData.senha) {
      usuarioData.senha = await bcrypt.hash(usuarioData.senha, 10);
    }
    
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...usuarioData })
      .eq('idusuario', idusuario)
      .select(`
        *,
        perfil:idperfil (
          idperfil,
          perfil
        )
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async excluir(idusuario) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('idusuario', idusuario);
    if (error) throw error;
    return true;
  }
};
