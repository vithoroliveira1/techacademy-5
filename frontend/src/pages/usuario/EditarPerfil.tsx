import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { validarCPF, validarSenhaForte, limparCPF } from '../../utils/validacoes';
import { api } from '../../services/api';

export function EditarPerfil() {
  const { usuario, carregarPerfil } = useAuth();
  const [form, setForm] = useState({ nome:'', senha:'', confSenha:'', cpf:'' });
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) setForm({ nome: usuario.nome, cpf: usuario.cpf, senha: '', confSenha: '' });
  }, [usuario]);

  function validar(): string | null {
    if (form.senha && form.senha !== form.confSenha) return 'Senhas divergem';
    if (!validarCPF(form.cpf)) return 'CPF inválido';
    if (form.senha && !validarSenhaForte(form.senha)) return 'Senha fraca';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(''); setOk('');
    const errValidacao = validar();
    if (errValidacao) return setErro(errValidacao);
    setLoading(true);
    try {
      await api.put(`/auth/perfil/${usuario?.id}`, { ...form, cpf: limparCPF(form.cpf) });
      await carregarPerfil();
      setOk('Perfil atualizado!');
      setForm(f => ({ ...f, senha: '', confSenha: '' }));
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro'); }
    finally { setLoading(false); }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>Editar Perfil</h2>
          <div style={{ maxWidth: '500px' }}>
            <Alert type="error" message={erro} />
            <Alert type="success" message={ok} />
            <form onSubmit={handleSubmit}>
              <Input label="Email" value={usuario?.email || ''} onChange={()=>{}} disabled readOnly />
              <Input label="Nome" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required />
              <Input label="CPF" value={form.cpf} onChange={e=>setForm({...form, cpf: e.target.value})} required />
              <Input label="Nova Senha" type="password" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} />
              <Input label="Confirmar Senha" type="password" value={form.confSenha} onChange={e=>setForm({...form, confSenha: e.target.value})} />
              <Button type="submit" loading={loading} className="mt-2">Salvar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
