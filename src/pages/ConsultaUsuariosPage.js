import React, { useEffect, useState, useRef } from 'react';
import UsuarioForm from '../components/UsuarioForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { usuarioService } from '../services/usuarioService';
import './ConsultaUsuariosPage.css';

const ConsultaUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, usuario: null });
  const resetFormRef = useRef(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const rows = await usuarioService.listar();
      setUsuarios(rows);
    } catch (e) {
      setMensagem(e.message || 'Falha ao carregar usuários');
      setTimeout(() => setMensagem(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      if (editingUsuario) {
        const updated = await usuarioService.atualizar(editingUsuario.idusuario, payload);
        setUsuarios((prev) => prev.map((u) => (u.idusuario === updated.idusuario ? updated : u)));
        setMensagem('Usuário atualizado com sucesso!');
        setEditingUsuario(null);
      } else {
        const saved = await usuarioService.cadastrar(payload);
        setUsuarios((prev) => [saved, ...prev]);
        setMensagem('Usuário cadastrado com sucesso!');
        if (resetFormRef.current) {
          resetFormRef.current();
        }
      }
    } catch (e) {
      setMensagem(e.message || 'Falha ao salvar usuário');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingUsuario(null);
    if (resetFormRef.current) {
      resetFormRef.current();
    }
  };

  const handleDeleteClick = (usuario) => {
    setDeleteDialog({ isOpen: true, usuario });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.usuario) return;
    
    const usuario = deleteDialog.usuario;
    const id = usuario.idusuario;
    
    try {
      setLoading(true);
      await usuarioService.excluir(id);
      setUsuarios((prev) => prev.filter((u) => u.idusuario !== id));
      setMensagem('Usuário excluído com sucesso!');
      setDeleteDialog({ isOpen: false, usuario: null });
    } catch (e) {
      setMensagem(e.message || 'Falha ao excluir usuário');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, usuario: null });
  };

  return (
    <div className="consulta-usuarios-page">
      <div className="page-container">
        <div className="card form-card">
          <div className="card-body">
            <h1>{editingUsuario ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h1>

            {mensagem && <div className="alert alert-success">{mensagem}</div>}

            <UsuarioForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingUsuario}
              mode={editingUsuario ? 'edit' : 'create'}
              onFormReset={(resetFn) => { resetFormRef.current = resetFn; }}
            />

            {loading && <div className="alert alert-info">Carregando...</div>}
          </div>
        </div>

        <h2 className="mt-4">Usuários cadastrados</h2>

        {usuarios.length === 0 ? (
          <p className="text-muted">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.idusuario}>
                    <td>{u.matricula}</td>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.telefone}</td>
                    <td>
                      <span className={`badge badge-${u.perfil?.perfil === 'Administrador' ? 'admin' : 'comum'}`}>
                        {u.perfil?.perfil || 'Comum'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(u)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${deleteDialog.usuario?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
        showUndoTimer={true}
        undoTimeout={5}
      />
    </div>
  );
};

export default ConsultaUsuariosPage;
