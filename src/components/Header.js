import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin, user, logout } = useAuth();

    const isHomePage = location.pathname === '/';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 onClick={() => navigate('/')} className="logo">
                    📦 Controle de Estoque
                </h1>

                <nav className="navigation">
                    {!isHomePage && (
                        <button
                            onClick={() => navigate('/')}
                            className="nav-button"
                        >
                            ← Voltar para Home
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => navigate('/usuarios')}
                            className="nav-button admin"
                        >
                            👥 Gerenciar Usuários
                        </button>
                    )}

                    <div className="user-info">
                        <span className="user-name">
                            {user?.nome || 'Usuário'} ({user?.perfil?.perfil === 'Comum' ? 'Funcionário' : user?.perfil?.perfil || 'Funcionário'})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="nav-button logout"
                        >
                            🚪 Sair
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
