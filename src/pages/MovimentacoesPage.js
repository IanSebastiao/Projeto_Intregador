// MovimentacoesPage.js
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './MovimentacoesPage.css';

const MovimentacoesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="movimentacoes-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Movimentações de Estoque</h1>
          <p className="page-subtitle">
            Gerencie as entradas, saídas e visualize relatórios do seu estoque
          </p>
        </div>

        <div className="features-grid">
          <button
            className="feature-card"
            onClick={() => navigate('/entradas')}
          >
            <div className="feature-icon">📥</div>
            <div className="feature-content">
              <h3>Entradas</h3>
              <p>Registro de compras, doações e retornos ao estoque</p>
              <span className="feature-link">Acessar Entradas →</span>
            </div>
          </button>

          <button
            className="feature-card"
            onClick={() => navigate('/saidas')}
          >
            <div className="feature-icon">📤</div>
            <div className="feature-content">
              <h3>Saídas</h3>
              <p>Controle de consumo interno, empréstimos e perdas</p>
              <span className="feature-link">Acessar Saídas →</span>
            </div>
          </button>

          <button
            className="feature-card"
            onClick={() => navigate('/relatorios')}
          >
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h3>Relatórios</h3>
              <p>Histórico completo e análises das movimentações</p>
              <span className="feature-link">Ver Relatórios →</span>
            </div>
          </button>
        </div>

        <div className="info-section">
          <h3>Como funciona?</h3>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <p><strong>Registre Entradas</strong> quando novos produtos chegarem</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p><strong>Registre Saídas</strong> quando produtos forem utilizados</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p><strong>Consulte Relatórios</strong> para acompanhar o histórico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovimentacoesPage;