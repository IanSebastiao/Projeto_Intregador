import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usuarioService } from '../services/usuarioService';
import { perfilService } from '../services/perfilService';

const EditarUsuario = ({ userId, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    matricula: '',
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    idperfil: '',
  });

  const [perfis, setPerfis] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar perfis
        const listaPerfis = await perfilService.listar();
        setPerfis(listaPerfis);

        // Carregar usuário
        const user = await usuarioService.buscarPorId(userId);
        setForm({
          matricula: user.matricula || '',
          nome: user.nome || '',
          telefone: user.telefone || '',
          email: user.email || '',
          senha: '', // Não preencher senha por segurança
          idperfil: user.idperfil || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  const validate = () => {
    const err = {};
    if (!form.matricula || form.matricula.trim() === '') err.matricula = 'Matrícula é obrigatória';
    if (!form.nome || form.nome.trim() === '') err.nome = 'Nome é obrigatório';
    if (!form.telefone || form.telefone.trim() === '') err.telefone = 'Telefone é obrigatório';
    if (!form.email || form.email.trim() === '') err.email = 'Email é obrigatório';
    if (!form.idperfil) err.idperfil = 'Perfil é obrigatório';
    
    // Senha é opcional na edição, mas se preenchida deve ter no mínimo 6 caracteres
    if (form.senha && form.senha.length < 6) {
      err.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Se senha estiver vazia, não enviar no update
    const dadosParaEnviar = { ...form };
    if (!dadosParaEnviar.senha) {
      delete dadosParaEnviar.senha;
    }
    
    if (typeof onSubmit === 'function') onSubmit(dadosParaEnviar);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="editar-usuario">
      <h2>Editar Usuário</h2>
      <form onSubmit={submit} aria-label="usuario-form">
        <div>
          <label htmlFor="matricula">Matrícula</label>
          <input 
            id="matricula" 
            name="matricula" 
            value={form.matricula} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label htmlFor="nome">Nome</label>
          <input 
            id="nome" 
            name="nome" 
            value={form.nome} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label htmlFor="telefone">Telefone</label>
          <input 
            id="telefone" 
            name="telefone" 
            value={form.telefone} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label htmlFor="senha">Nova Senha (deixe em branco para não alterar)</label>
          <input 
            id="senha" 
            name="senha" 
            type="password"
            value={form.senha} 
            onChange={handleChange}
            placeholder="Digite nova senha ou deixe em branco"
          />
        </div>

        <div>
          <label htmlFor="idperfil">Perfil</label>
          <select 
            id="idperfil" 
            name="idperfil" 
            value={form.idperfil} 
            onChange={handleChange}
          >
            <option value="">Selecione um perfil</option>
            {perfis.map(perfil => (
              <option key={perfil.idperfil} value={perfil.idperfil}>
                {perfil.perfil}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(errors).length > 0 && (
          <div role="alert" style={{ color: 'red', marginTop: 8 }}>
            {Object.values(errors).join(' - ')}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => typeof onCancel === 'function' && onCancel()} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

EditarUsuario.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EditarUsuario;
