import React from 'react';
import Header from '../../Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;


// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import './Layout.css';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isActive = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

//   return (
//     <div className="layout">
//       {/* Sidebar/Navbar */}
//       <nav className="sidebar">
//         <div className="sidebar-header">
//           <h1 className="logo">📦 EstoquePro</h1>
//           <p className="user-info">
//             Olá, <strong>{user?.nome || 'Usuário'}</strong>
//           </p>
//           <p className="user-role">
//             {user?.tipo === 'admin' ? '👑 Administrador' : '👤 Usuário'}
//           </p>
//         </div>

//         <div className="nav-menu">
//           <NavLink to="/" className={isActive} end>
//             🏠 Início
//           </NavLink>

//           <div className="nav-section">
//             <h3>📦 Estoque</h3>
//             <NavLink to="/cadastro-produto" className={isActive}>
//               ➕ Cadastrar Produto
//             </NavLink>
//             <NavLink to="/consulta-estoque" className={isActive}>
//               🔍 Consultar Estoque
//             </NavLink>
//           </div>

//           <div className="nav-section">
//             <h3>🔄 Movimentações</h3>
//             <NavLink to="/movimentacoes" className={isActive}>
//               📋 Painel de Movimentações
//             </NavLink>
//             <NavLink to="/entradas" className={isActive}>
//               📥 Entradas
//             </NavLink>
//             <NavLink to="/saidas" className={isActive}>
//               📤 Saídas
//             </NavLink>
//             <NavLink to="/relatorios" className={isActive}>
//               📊 Relatórios
//             </NavLink>
//           </div>

//           {user?.tipo === 'admin' && (
//             <div className="nav-section">
//               <h3>⚙️ Administração</h3>
//               <NavLink to="/usuarios" className={isActive}>
//                 👥 Gerenciar Usuários
//               </NavLink>
//               <NavLink to="/fornecedores" className={isActive}>
//                 🏢 Fornecedores
//               </NavLink>
//             </div>
//           )}

//           <div className="nav-section">
//             <h3>👤 Minha Conta</h3>
//             <NavLink to="/editar-usuario" className={isActive}>
//               ⚙️ Configurações
//             </NavLink>
//             <button onClick={handleLogout} className="logout-btn">
//               🚪 Sair
//             </button>
//           </div>
//         </div>

//         <div className="sidebar-footer">
//           <p className="version">Versão 1.0.0</p>
//         </div>
//       </nav>

//       {/* Conteúdo Principal */}
//       <main className="main-content">
//         {/* Header Mobile (apenas em telas pequenas) */}
//         <header className="mobile-header">
//           <button 
//             className="menu-toggle" 
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             ☰
//           </button>
//           <h2 className="mobile-logo">📦 EstoquePro</h2>
//           <div className="user-dropdown">
//             <button 
//               className="user-toggle" 
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               👤 {user?.nome || 'Usuário'}
//             </button>
//             {dropdownOpen && (
//               <div className="dropdown-menu">
//                 <p><strong>{user?.nome}</strong></p>
//                 <p className="user-role-mobile">
//                   {user?.tipo === 'admin' ? '👑 Admin' : '👤 Usuário'}
//                 </p>
//                 <NavLink to="/editar-usuario" onClick={() => setDropdownOpen(false)}>
//                   ⚙️ Configurações
//                 </NavLink>
//                 <button onClick={handleLogout}>
//                   🚪 Sair
//                 </button>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Menu Mobile (apenas em telas pequenas) */}
//         {menuOpen && (
//           <div className="mobile-menu">
//             <NavLink to="/" onClick={() => setMenuOpen(false)}>
//               🏠 Início
//             </NavLink>
//             <NavLink to="/cadastro-produto" onClick={() => setMenuOpen(false)}>
//               ➕ Cadastrar Produto
//             </NavLink>
//             <NavLink to="/consulta-estoque" onClick={() => setMenuOpen(false)}>
//               🔍 Consultar Estoque
//             </NavLink>
//             <NavLink to="/movimentacoes" onClick={() => setMenuOpen(false)}>
//               📋 Movimentações
//             </NavLink>
//             <NavLink to="/entradas" onClick={() => setMenuOpen(false)}>
//               📥 Entradas
//             </NavLink>
//             <NavLink to="/saidas" onClick={() => setMenuOpen(false)}>
//               📤 Saídas
//             </NavLink>
//             <NavLink to="/relatorios" onClick={() => setMenuOpen(false)}>
//               📊 Relatórios
//             </NavLink>
//             {user?.tipo === 'admin' && (
//               <>
//                 <NavLink to="/usuarios" onClick={() => setMenuOpen(false)}>
//                   👥 Usuários
//                 </NavLink>
//                 <NavLink to="/fornecedores" onClick={() => setMenuOpen(false)}>
//                   🏢 Fornecedores
//                 </NavLink>
//               </>
//             )}
//           </div>
//         )}

//         {/* Conteúdo da Página */}
//         <div className="content-container">
//           {children}
//         </div>

//         {/* Footer */}
//         <footer className="main-footer">
//           <p>© {new Date().getFullYear()} EstoquePro - Sistema de Controle de Estoque</p>
//           <p className="footer-links">
//             <span>📧 suporte@estoquepro.com</span>
//             <span>📞 (11) 99999-9999</span>
//           </p>
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Layout;