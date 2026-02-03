import React, { useEffect, useState } from 'react';
import { movimentacaoService } from '../services/movimentacaoService';
import { produtoService } from '../services/produtoService';
import { useAuth } from '../contexts/AuthContext';
import { formatarDataHoraSP } from '../utils/formatters';
import './RelatoriosPage.css';

const RelatoriosPage = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMovimentacoes();
    fetchProdutos();
  }, []);

  const fetchMovimentacoes = async () => {
    try {
      const lista = await movimentacaoService.listar();
      setMovimentacoes(lista);
    } catch (e) {
      console.error('Erro ao carregar movimentações:', e);
      setErro('Erro ao carregar movimentações.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async () => {
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    }
  };

  const getProdutoNome = (produtoId) => {
    // Tenta encontrar o produto com qualquer variação de ID
    const produto = produtos.find(p => 
      String(p.idproduto) === String(produtoId) || 
      String(p.id) === String(produtoId)
    );
    return produto ? produto.nome : `Produto ${produtoId}`;
  };

  const formatarDataHora = (dataRegistro) => {
    return formatarDataHoraSP(dataRegistro);
  };

  return (
    <div className="relatorios-page">
      <h2>📊 Relatórios de Movimentações</h2>
      <p>Histórico completo das movimentações de produtos com data e hora</p>
      
      {user && (
        <div className="usuario-logado-info">
          <p>Usuário logado: <strong>{user.email}</strong></p>
        </div>
      )}

      {loading && <p>Carregando relatórios...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!loading && !erro && movimentacoes.length === 0 && (
        <p>Nenhuma movimentação registrada.</p>
      )}
      {!loading && !erro && movimentacoes.length > 0 && (
        <div className="relatorios-tabela-wrapper">
          <table className="relatorios-tabela">
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Responsável</th>
                <th>Usuário</th>
                <th>Matrícula</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map(mov => (
                <tr key={mov.id}>
                  <td data-label="Data e Hora">{formatarDataHora(mov.dataregistro || mov.dataRegistro)}</td>
                  <td data-label="Produto">{getProdutoNome(mov.produtoid || mov.produtoId)}</td>
                  <td data-label="Tipo">
                    <span className={`tipo-movimentacao ${mov.tipo}`}>
                      {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td data-label="Quantidade">{Math.abs(mov.quantidade)}</td>
                  <td data-label="Responsável">{mov.responsavel || '-'}</td>
                  <td data-label="Usuário"><strong>{mov.usuario_nome || mov.usuario || mov.usuarioNome || mov.usuarioemail || mov.usuarioEmail || '-'}</strong></td>
                  <td data-label="Matrícula">{mov.usuario_matricula || '-'}</td>
                  <td data-label="Observação">{mov.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RelatoriosPage;
