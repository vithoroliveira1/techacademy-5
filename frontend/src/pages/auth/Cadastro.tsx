import React, { useState } from 'react';
import { Button, Input, Alert } from '../../components/common';
import { Link, useNavigate } from 'react-router-dom';
import { validarEmail, validarCPF, validarSenhaForte, limparCPF } from '../../utils/validacoes';
import { api } from '../../services/api';
import '../../components/layout/layout.css';

export function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome:'', email:'', senha:'', confSenha:'', cpf:'' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function validarForm(): string | null {
    if (form.senha !== form.confSenha) return 'Senhas divergem';
    if (!validarEmail(form.email)) return 'Email inválido';
    if (!validarCPF(form.cpf)) return 'CPF inválido';
    if (!validarSenhaForte(form.senha)) return 'Senha fraca (min 8 chars, maiúscula, minúscula, num, especial)';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const erroValidacao = validarForm();
    if (erroValidacao) return setErro(erroValidacao);
    setLoading(true);
    try {
      await api.post('/auth/registrar', { ...form, cpf: limparCPF(form.cpf) });
      navigate('/login');
    } catch (err) { 
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro no cadastro'); 
    }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Criar Conta</h2>
        <Alert type="error" message={erro} />
        <Input label="Nome" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required />
        <Input label="CPF" value={form.cpf} onChange={e=>setForm({...form, cpf: e.target.value})} required />
        <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
        <Input label="Senha" type="password" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} required />
        <Input label="Confirmar Senha" type="password" value={form.confSenha} onChange={e=>setForm({...form, confSenha: e.target.value})} required />
        <Button type="submit" loading={loading} className="w-full mt-2">Cadastrar</Button>
        <div className="auth-link">Já tem conta? <Link to="/login">Entrar</Link></div>
      </form>
    </div>
  );
}
