import React, { useEffect, useState } from 'react';
import { produtoService } from '../services/produtoService';
import { movimentacaoService } from '../services/movimentacaoService';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentDateSP } from '../utils/formatters';
import './EntradasPage.css';

const EntradasPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [quantidades, setQuantidades] = useState({});
  const [responsaveis, setResponsaveis] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [adicionando, setAdicionando] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProdutos();
    fetchTipos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
      setErro('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    try {
      const tiposData = await produtoService.listarTipos();
      setTipos(tiposData || []);
    } catch (e) {
      console.error('Erro ao carregar tipos:', e);
    }
  };

  const getTipoNome = (idtipo) => {
    const tipo = tipos.find(t => String(t.idtipo) === String(idtipo));
    return tipo ? tipo.tipo : `Tipo ${idtipo}`;
  };

  const handleQuantidadeChange = (produtoId, value) => {
    setQuantidades(prev => ({
      ...prev,
      [produtoId]: value
    }));
  };

  const handleResponsavelChange = (produtoId, value) => {
    setResponsaveis(prev => ({
      ...prev,
      [produtoId]: value
    }));
  };

  const handleObservacaoChange = (produtoId, value) => {
    setObservacoes(prev => ({
      ...prev,
      [produtoId]: value
    }));
  };

  const handleAdicionar = async (produto) => {
    const quantidade = parseInt(quantidades[produto.idproduto]);
    const responsavel = responsaveis[produto.idproduto]?.trim();
    const observacao = observacoes[produto.idproduto]?.trim();

    if (!quantidade || quantidade <= 0) {
      alert('Por favor, insira uma quantidade válida maior que zero.');
      return;
    }

    if (!responsavel) {
      alert('Por favor, insira o nome do responsável.');
      return;
    }

    setAdicionando(produto.idproduto);

    try {
      const movimentacaoData = {
        tipo: 'entrada',
        produtoId: produto.idproduto,
        quantidade: quantidade,
        data: getCurrentDateSP(),
        responsavel: responsavel,
        observacao: observacao || ''
      };

      if (user?.nome) {
        movimentacaoData.usuarioNome = user.nome;
      } else if (user?.email) {
        movimentacaoData.usuarioNome = user.email;
      } else {
        movimentacaoData.usuarioNome = 'Desconhecido';
      }

      if (user?.matricula) {
        movimentacaoData.usuarioMatricula = user.matricula;
      }

      await movimentacaoService.registrar(movimentacaoData);

      // Atualizar quantidade no produto
      const novaQuantidade = produto.quantidade + quantidade;
      await produtoService.atualizar(produto.idproduto, { quantidade: novaQuantidade });

      // Limpar campos
      setQuantidades(prev => ({ ...prev, [produto.idproduto]: '' }));
      setResponsaveis(prev => ({ ...prev, [produto.idproduto]: '' }));
      setObservacoes(prev => ({ ...prev, [produto.idproduto]: '' }));

      // Recarregar produtos
      await fetchProdutos();

      alert(`Entrada de ${quantidade} unidade(s) de "${produto.nome}" registrada com sucesso!`);
    } catch (e) {
      console.error('Erro ao registrar entrada:', e);
      alert('Erro ao registrar entrada. Tente novamente.');
    } finally {
      setAdicionando(null);
    }
  };

  return (
    <div className="entradas-page">
      <h2>📥 Entradas de Estoque</h2>
      <p>Selecione um item do estoque e adicione uma quantidade</p>

      {user && (
        <div className="usuario-logado-info">
          <p>Usuário logado: <strong>{user.email}</strong></p>
        </div>
      )}

      {loading && <p>Carregando produtos...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!loading && !erro && produtos.length === 0 && (
        <p>Nenhum produto cadastrado.</p>
      )}
      {!loading && !erro && produtos.length > 0 && (
        <div className="produtos-lista">
          {produtos.map(produto => (
            <div key={produto.idproduto} className="produto-card">
              <div className="produto-info">
                <h3>{produto.nome}</h3>
                <p><strong>Tipo:</strong> {getTipoNome(produto.idtipo)}</p>
                <p><strong>Estoque Atual:</strong> {produto.quantidade}</p>
                <p><strong>Localização:</strong> {produto.local || '-'}</p>
                <p><strong>Código:</strong> {produto.codigo || '-'}</p>
              </div>
              <div className="entrada-form">
                <div className="form-group">
                  <label>Quantidade a Adicionar:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantidades[produto.idproduto] || ''}
                    onChange={(e) => handleQuantidadeChange(produto.idproduto, e.target.value)}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="form-group">
                  <label>Responsável:</label>
                  <input
                    type="text"
                    value={responsaveis[produto.idproduto] || ''}
                    onChange={(e) => handleResponsavelChange(produto.idproduto, e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="form-group">
                  <label>Observação (opcional):</label>
                  <textarea
                    value={observacoes[produto.idproduto] || ''}
                    onChange={(e) => handleObservacaoChange(produto.idproduto, e.target.value)}
                    placeholder="Observações sobre a entrada"
                    rows="2"
                  />
                </div>
                <button
                  className="btn-adicionar"
                  onClick={() => handleAdicionar(produto)}
                  disabled={adicionando === produto.idproduto}
                >
                  {adicionando === produto.idproduto ? 'Adicionando...' : 'Adicionar ao Estoque'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntradasPage;
