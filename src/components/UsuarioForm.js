import React, { useState, useEffect, useRef } from 'react';
import { formatPhoneBR } from '../utils/formatters';
import { perfilService } from '../services/perfilService';
import './UsuarioForm.css';

export default function UsuarioForm({ onSubmit, initialData = {}, onCancel, mode = 'create', onFormReset }) {
  const [form, setForm] = useState({
    matricula: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    idperfil: '2', // Padrão: Comum
  });
  const [perfis, setPerfis] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    loadPerfis();
  }, []);

  useEffect(() => {
    if (!initialData || !initialData.idusuario) return;
    setForm({
      matricula: initialData.matricula || '',
      nome: initialData.nome || '',
      email: initialData.email || '',
      telefone: initialData.telefone || '',
      senha: '',
      confirmarSenha: '',
      idperfil: initialData.idperfil?.toString() || '2',
    });
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (typeof onFormReset === 'function') {
      onFormReset(() => resetForm());
    }
  }, [onFormReset]);

  const loadPerfis = async () => {
    try {
      const data = await perfilService.listar();
      setPerfis(data || []);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };

  const resetForm = () => {
    setForm({
      matricula: '',
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      confirmarSenha: '',
      idperfil: '2',
    });
    setErrors({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === 'telefone') next = formatPhoneBR(value);
    setForm((f) => ({ ...f, [name]: next }));
  };

  const validate = () => {
    const errs = {};
    
    if (!form.matricula.trim()) errs.matricula = 'Matrícula é obrigatória';
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email inválido';
    if (!form.telefone.trim()) errs.telefone = 'Telefone é obrigatório';
    
    // Validação de senha apenas no modo create ou se senha foi preenchida no edit
    if (mode === 'create') {
      if (!form.senha) errs.senha = 'Senha é obrigatória';
      else if (form.senha.length < 6) errs.senha = 'Senha deve ter pelo menos 6 caracteres';
      if (!form.confirmarSenha) errs.confirmarSenha = 'Confirme a senha';
      else if (form.senha !== form.confirmarSenha) errs.confirmarSenha = 'As senhas não coincidem';
    } else if (mode === 'edit' && form.senha) {
      if (form.senha.length < 6) errs.senha = 'Senha deve ter pelo menos 6 caracteres';
      if (form.senha !== form.confirmarSenha) errs.confirmarSenha = 'As senhas não coincidem';
    }
    
    if (!form.idperfil) errs.idperfil = 'Perfil é obrigatório';
    
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    setLoading(true);
    try {
      const payload = {
        matricula: form.matricula.trim(),
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        idperfil: parseInt(form.idperfil),
      };
      
      // Adiciona senha apenas se foi preenchida
      if (form.senha) {
        payload.senha = form.senha;
      }
      
      if (typeof onSubmit === 'function') {
        await onSubmit(payload);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} className="usuario-form" onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="matricula" className="form-label">Matrícula</label>
        <input
          id="matricula"
          name="matricula"
          type="text"
          className="form-control"
          value={form.matricula}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.matricula && <div className="text-danger" role="alert">{errors.matricula}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome Completo</label>
        <input
          id="nome"
          name="nome"
          type="text"
          className="form-control"
          value={form.nome}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.nome && <div className="text-danger" role="alert">{errors.nome}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.email && <div className="text-danger" role="alert">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="telefone" className="form-label">Telefone</label>
        <input
          id="telefone"
          name="telefone"
          type="text"
          className="form-control"
          value={form.telefone}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.telefone && <div className="text-danger" role="alert">{errors.telefone}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="idperfil" className="form-label">Perfil</label>
        <select
          id="idperfil"
          name="idperfil"
          className="form-control"
          value={form.idperfil}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Selecione um perfil</option>
          {perfis.map((perfil) => (
            <option key={perfil.idperfil} value={perfil.idperfil}>
              {perfil.perfil}
            </option>
          ))}
        </select>
        {errors.idperfil && <div className="text-danger" role="alert">{errors.idperfil}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="senha" className="form-label">
          {mode === 'edit' ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          className="form-control"
          value={form.senha}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.senha && <div className="text-danger" role="alert">{errors.senha}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmarSenha" className="form-label">Confirmar Senha</label>
        <input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          className="form-control"
          value={form.confirmarSenha}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.confirmarSenha && <div className="text-danger" role="alert">{errors.confirmarSenha}</div>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {typeof onCancel === 'function' && (
          <button type="button" className="btn btn-cancelar" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
