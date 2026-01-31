import React, { useState } from 'react';
import './MovimentacaoModal.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { movimentacaoService } from '../services/movimentacaoService';
import { getCurrentDateSP } from '../utils/formatters';
import { produtoService } from '../services/produtoService';
import MovimentacaoNotificacao from './MovimentacaoNotificacao';

const MovimentacaoModal = ({ produto, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    quantidade: '',
    responsavel: '',
    observacao: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notificacao, setNotificacao] = useState({ 
    isOpen: false, 
    tipo: 'entrada', 
    quantidade: 0,
    produtoNome: ''
  });
  const navigate = useNavigate();
    const { user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.quantidade || formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade é obrigatória e deve ser maior que zero';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMovimentacao = async (tipo) => {
    // Verificar permissão: usuários não-admin não podem adicionar
    const isAdmin = user?.idperfil === 1;
    if (tipo === 'entrada' && !isAdmin) {
      alert('❌ Você não tem permissão para adicionar itens ao estoque.\n\nPor favor, contate um superior para realizar esta operação.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const quantidade = Math.abs(parseInt(formData.quantidade));
      const movimentacaoData = {
        tipo: tipo,
        produtoId: produto.idproduto,
        quantidade: tipo === 'saida' ? -quantidade : quantidade,
        data: getCurrentDateSP(),
        responsavel: formData.responsavel.trim(),
        observacao: formData.observacao.trim()
      };
        // adicionar nome do usuário que realizou a ação (se disponível)
        // Tenta usar nome, se não tiver usa email, senão usa 'Desconhecido'
        if (user?.nome) {
          movimentacaoData.usuarioNome = user.nome;
        } else if (user?.email) {
          movimentacaoData.usuarioNome = user.email;
        } else {
          movimentacaoData.usuarioNome = 'Desconhecido';
        }

        // Adicionar matrícula do usuário se disponível
        if (user?.matricula) {
          movimentacaoData.usuarioMatricula = user.matricula;
        }

      // Registrar a movimentação
      await movimentacaoService.registrar(movimentacaoData);

      // Atualizar a quantidade no estoque do produto
      const novaQuantidade = tipo === 'saida' 
        ? produto.quantidade - quantidade 
        : produto.quantidade + quantidade;

      await produtoService.atualizar(produto.idproduto, {
        quantidade: novaQuantidade
      });
      
      setNotificacao({
        isOpen: true,
        tipo: tipo,
        quantidade: quantidade,
        produtoNome: produto.nome
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
        navigate('/consulta-estoque');
      }, 3500);
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      setErrors({ submit: 'Erro ao registrar movimentação. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movimentacao-modal-overlay">
      <div className="movimentacao-modal">
        <div className="modal-header">
          <h2>Movimentar Produto</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="produto-info">
            <p><strong>Produto:</strong> {produto.nome}</p>
            <p><strong>Estoque Atual:</strong> {produto.quantidade} unidades</p>
          </div>

          <form className="movimentacao-form-inline">
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade *</label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="1"
                placeholder="Digite a quantidade"
                className={errors.quantidade ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.quantidade && <span className="error-message">{errors.quantidade}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="responsavel">Responsável *</label>
              <input
                type="text"
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className={errors.responsavel ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.responsavel && <span className="error-message">{errors.responsavel}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="observacao">Observação</label>
              <textarea
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Observações adicionais (opcional)"
                rows="2"
                disabled={isLoading}
              />
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}
          </form>
        </div>

      <div className="modal-footer">
          <button
            className="btn-cancelar"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-retirar"
            onClick={() => handleMovimentacao('saida')}
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Retirar'}
          </button>
          <button
            className="btn-adicionar"
            onClick={() => handleMovimentacao('entrada')}
            disabled={isLoading || user?.idperfil !== 1}
            title={user?.idperfil !== 1 ? 'Você não tem permissão para adicionar itens' : ''}
          >
            {isLoading ? 'Processando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      {notificacao.isOpen && (
        <MovimentacaoNotificacao
          tipo={notificacao.tipo}
          quantidade={notificacao.quantidade}
          produtoNome={notificacao.produtoNome}
          onClose={() => setNotificacao({ ...notificacao, isOpen: false })}
        />
      )}
    </div>
  );
};

export default MovimentacaoModal;
