import { supabase } from './supabase';

const TABLE = 'movimentacao';

export const movimentacaoService = {
    async registrar(movimentacaoData) {
        const dataToInsert = {
            tipo: movimentacaoData.tipo,
            produtoid: movimentacaoData.produtoId,
            quantidade: movimentacaoData.quantidade,
            data: movimentacaoData.data,
            responsavel: movimentacaoData.responsavel,
            observacao: movimentacaoData.observacao,
            dataregistro: new Date().toISOString()
        };

        // Se foi passado nome do usuário, adiciona ao payload (campo 'usuario')
        if (movimentacaoData.usuarioNome) {
            dataToInsert.usuario = movimentacaoData.usuarioNome;
            dataToInsert.usuario_nome = movimentacaoData.usuarioNome;
        }

        // Se foi passado matrícula do usuário, adiciona ao payload
        if (movimentacaoData.usuarioMatricula) {
            dataToInsert.usuario_matricula = movimentacaoData.usuarioMatricula;
        }

        try {
            const { data, error } = await supabase
                .from(TABLE)
                .insert([dataToInsert])
                .select()
                .single();
            if (error) {
                throw error;
            }
            return data;
        } catch (e) {
            // Se falhou por causa de coluna inexistente, tentar novamente sem os campos opcionais
            const message = (e?.message || '').toLowerCase();
            const isColumnError = message.includes('column');
            if (isColumnError && (dataToInsert.usuario_nome || dataToInsert.usuario_matricula)) {
                delete dataToInsert.usuario_nome;
                delete dataToInsert.usuario_matricula;
                const { data, error } = await supabase
                    .from(TABLE)
                    .insert([dataToInsert])
                    .select()
                    .single();
                if (error) throw error;
                return data;
            }
            throw e;
        }
    },

    async atualizar(id, movimentacaoData) {
        const { data, error } = await supabase
            .from(TABLE)
            .update({ ...movimentacaoData })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async listar() {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('id', { ascending: false });
        if (error) throw error;
        return data;
    },

    async buscarPorId(id) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async listarPorProduto(produtoId) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('produtoId', produtoId)
            .order('id', { ascending: false });
        if (error) throw error;
        return data;
    },

    async excluir(id) {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};
