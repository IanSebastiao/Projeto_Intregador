import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user, perfil } = useAuth();

  if (!user) return null;

  const perfilDisplay = perfil === 'Comum' ? 'Funcionário' : perfil;

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>Logado como <strong>{perfilDisplay}</strong> - {user.nome}</p>
      </div>
    </footer>
  );
};

export default Footer;
