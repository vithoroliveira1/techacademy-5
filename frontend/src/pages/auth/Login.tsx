import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert } from '../../components/common';
import { Link, useNavigate } from 'react-router-dom';
import { validarEmail } from '../../utils/validacoes';
import '../../components/layout/layout.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!validarEmail(email)) return setErro('Email inválido');
    setLoading(true);
    try {
      await login({ email, senha });
      // O redirecionamento base agora é feito pelo HomeRedirect via `/`
      navigate('/');
    } catch (err) { 
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro no login'); 
    }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Entrar no Sistema</h2>
        <Alert type="error" message={erro} />
        <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <Input label="Senha" value={senha} onChange={e=>setSenha(e.target.value)} type="password" required />
        <Button type="submit" loading={loading} className="w-full mt-2">Entrar</Button>
        <div className="auth-link">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></div>
      </form>
    </div>
  );
}
