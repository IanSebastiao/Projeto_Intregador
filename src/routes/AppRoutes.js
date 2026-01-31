import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CadastroProdutoPage from '../pages/CadastroProdutoPage';
import EditarProdutoPage from '../pages/EditarProdutoPage';
import ConsultaEstoquePage from '../pages/ConsultaEstoquePage';
import MovimentacoesPage from '../pages/MovimentacoesPage';
import EntradasPage from '../pages/EntradasPage';
import SaidasPage from '../pages/SaidasPage';
import RelatoriosPage from '../pages/RelatoriosPage';
import CadastroFornecedorPage from '../pages/CadastroFornecedorPage';
import EditarUsuarioPage from '../pages/EditarUsuarioPage';
import ConsultaUsuariosPage from '../pages/ConsultaUsuariosPage';
import { produtoService } from '../services/produtoService';
import { movimentacaoService } from '../services/movimentacaoService';
import { usuarioService } from '../services/usuarioService';

const AppRoutes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Handlers para Produtos
  const handleAddProduto = async (produtoData) => {
    try {
      await produtoService.cadastrar(produtoData);
      alert('Produto cadastrado com sucesso!');
      navigate('/consulta-estoque');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto. Tente novamente.');
    }
  };

  const handleEditProduto = async (id, produtoData) => {
    try {
      await produtoService.atualizar(id, produtoData);
      alert('Produto atualizado com sucesso!');
      navigate('/consulta-estoque');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  // Handlers para Movimentações
  const handleAddMovimentacao = async (movimentacaoData) => {
    try {
      await movimentacaoService.registrar(movimentacaoData);
      alert('Movimentação registrada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação. Tente novamente.');
    }
  };

  const handleEditMovimentacao = async (id, movimentacaoData) => {
    try {

      await movimentacaoService.atualizar(id, movimentacaoData);
      alert('Movimentação atualizada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
      alert('Erro ao atualizar movimentação. Tente novamente.');
    }
  };

  // Handlers para Usuários
  const handleEditUsuario = async (id, usuarioData) => {
    try {
      await usuarioService.atualizar(id, usuarioData);
      alert('Usuário atualizado com sucesso!');
      navigate('/usuarios'); // Assumindo que há uma rota /usuarios
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  // Componente NotFoundPage interno
  const NotFoundPage = () => (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <button onClick={() => navigate('/')}>Voltar para Home</button>
    </div>
  );

  return (
    <Routes>
      {/* Rotas de Autenticação - sem Layout */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Rotas Protegidas - com Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Página Inicial */}
                <Route path="/" element={<HomePage />} />

                <Route path="/consulta-estoque" element={<ConsultaEstoquePage />} />

                {/* Página de Movimentações - Apenas para Administradores */}
                <Route
                  path="/movimentacoes"
                  element={
                    <AdminRoute>
                      <RelatoriosPage />
                    </AdminRoute>
                  }
                />

                {/* Rotas de Movimentações - Páginas Separadas - Apenas para Administradores
                <Route
                  path="/entradas"
                  element={
                    <AdminRoute>
                      <EntradasPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/saidas"
                  element={
                    <AdminRoute>
                      <SaidasPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/relatorios"
                  element={
                    <AdminRoute>
                      <RelatoriosPage />
                    </AdminRoute>
                  }
                /> */}
                {/* Rotas de Usuários - Apenas para Administradores */}
                <Route
                  path="/usuarios"
                  element={
                    <AdminRoute>
                      <ConsultaUsuariosPage />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/editar-usuario/:id"
                  element={
                    <AdminRoute>
                      <EditarUsuarioPage />
                    </AdminRoute>
                  }
                />

                {/* Rotas de Fornecedores */}
                <Route
                  path="/fornecedores"
                  element={
                    <AdminRoute>
                      <CadastroFornecedorPage />
                    </AdminRoute>
                  }
                />

                {/* Rotas de Produtos */}
                <Route
                  path="/cadastro-produto"
                  element={
                    <AdminRoute>
                      <CadastroProdutoPage
                        onSubmit={handleAddProduto}
                        mode="create"
                      />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/editar-produto/:id"
                  element={
                    <AdminRoute>
                      <EditarProdutoPage />
                    </AdminRoute>
                  }
                />

                {/* Rota 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

