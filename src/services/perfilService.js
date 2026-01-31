import { supabase } from './supabase';

const TABLE = 'perfil';

export const perfilService = {
  async listar() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('idperfil', { ascending: true });
    if (error) throw error;
    return data;
  },

  async buscarPorId(idperfil) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('idperfil', idperfil)
      .single();
    if (error) throw error;
    return data;
  }
};
