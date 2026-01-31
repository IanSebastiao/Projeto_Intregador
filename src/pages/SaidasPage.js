import React, { useEffect, useState } from 'react';
import { produtoService } from '../services/produtoService';
import { movimentacaoService } from '../services/movimentacaoService';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentDateSP } from '../utils/formatters';
import './SaidasPage.css';

const SaidasPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [quantidades, setQuantidades] = useState({});
  const [responsaveis, setResponsaveis] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [removendo, setRemovendo] = useState(null);
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

  const handleRemover = async (produto) => {
    const quantidade = parseInt(quantidades[produto.idproduto]);
    const responsavel = responsaveis[produto.idproduto]?.trim();
    const observacao = observacoes[produto.idproduto]?.trim();

    if (!quantidade || quantidade <= 0) {
      alert('Por favor, insira uma quantidade válida maior que zero.');
      return;
    }

    if (quantidade > produto.quantidade) {
      alert(`Quantidade insuficiente em estoque. Disponível: ${produto.quantidade}`);
      return;
    }

    if (!responsavel) {
      alert('Por favor, insira o nome do responsável.');
      return;
    }

    setRemovendo(produto.idproduto);

    try {
      const movimentacaoData = {
        tipo: 'saida',
        produtoId: produto.idproduto,
        quantidade: -quantidade, // Negativo para saída
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
      const novaQuantidade = produto.quantidade - quantidade;
      await produtoService.atualizar(produto.idproduto, { quantidade: novaQuantidade });

      // Limpar campos
      setQuantidades(prev => ({ ...prev, [produto.idproduto]: '' }));
      setResponsaveis(prev => ({ ...prev, [produto.idproduto]: '' }));
      setObservacoes(prev => ({ ...prev, [produto.idproduto]: '' }));

      // Recarregar produtos
      await fetchProdutos();

      alert(`Saída de ${quantidade} unidade(s) de "${produto.nome}" registrada com sucesso!`);
    } catch (e) {
      console.error('Erro ao registrar saída:', e);
      alert('Erro ao registrar saída. Tente novamente.');
    } finally {
      setRemovendo(null);
    }
  };

  return (
    <div className="saidas-page">
      <h2>📤 Saídas de Estoque</h2>
      <p>Selecione um item do estoque e retire uma quantidade</p>

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
              <div className="saida-form">
                <div className="form-group">
                  <label>Quantidade a Retirar:</label>
                  <input
                    type="number"
                    min="1"
                    max={produto.quantidade}
                    value={quantidades[produto.idproduto] || ''}
                    onChange={(e) => handleQuantidadeChange(produto.idproduto, e.target.value)}
                    placeholder="Ex: 5"
                  />
                  {produto.quantidade === 0 && (
                    <small style={{ color: '#dc3545' }}>Estoque esgotado</small>
                  )}
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
                    placeholder="Observações sobre a saída"
                    rows="2"
                  />
                </div>
                <button
                  className="btn-remover"
                  onClick={() => handleRemover(produto)}
                  disabled={removendo === produto.idproduto || produto.quantidade === 0}
                >
                  {removendo === produto.idproduto ? 'Removendo...' : 'Retirar do Estoque'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaidasPage;
