import React, { useEffect, useState } from 'react';
import './MovimentacaoNotificacao.css';

const MovimentacaoNotificacao = ({ 
  tipo = 'entrada',
  quantidade = 0,
  produtoNome = '',
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!autoClose) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, 100 - (elapsed / autoCloseDelay) * 100);
      setProgress(newProgress);

      if (elapsed >= autoCloseDelay) {
        clearInterval(interval);
        handleClose();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  };

  if (!isVisible) return null;

  const isEntrada = tipo === 'entrada';
  const titulo = isEntrada ? '✓ Entrada Registrada!' : '✓ Saída Registrada!';
  const mensagem = isEntrada 
    ? `${quantidade} unidade(s) adicionada(s) ao estoque de "${produtoNome}"`
    : `${quantidade} unidade(s) removida(s) do estoque de "${produtoNome}"`;

  return (
    <div className={`movimentacao-notificacao ${isEntrada ? 'entrada' : 'saida'} ${!isVisible ? 'closing' : ''}`}>
      <div className="notificacao-conteudo">
        <div className="notificacao-icone">
          {isEntrada ? '📦' : '📤'}
        </div>
        <div className="notificacao-texto">
          <h3>{titulo}</h3>
          <p>{mensagem}</p>
        </div>
        <button className="notificacao-fechar" onClick={handleClose}>×</button>
      </div>
      {autoClose && (
        <div className="notificacao-progress">
          <div className="notificacao-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default MovimentacaoNotificacao;
