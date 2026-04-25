import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Select, Alert } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Carro } from '../../types';
import { validarCPF, limparCPF } from '../../utils/validacoes';

export function FormVenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ carro_id: '', comprador_nome: '', comprador_cpf: '', valor_venda: '', data_venda: '' });
  const [carros, setCarros] = useState<{label: string, value: number}[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/carros?limit=100').then(r => setCarros(r.data.data.map((c: Carro) => ({ label: `${c.marca_nome} ${c.modelo}`, value: c.id }))));
    if (id) api.get(`/vendas/${id}`).then(r => setForm({...r.data, data_venda: r.data.data_venda.split('T')[0]})).catch(e => setErro('Erro'));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!validarCPF(form.comprador_cpf)) return setErro('CPF do comprador é inválido');
    try {
      const payload = { ...form, comprador_cpf: limparCPF(form.comprador_cpf) };
      if (id) await api.put(`/vendas/${id}`, payload);
      else await api.post('/vendas', payload);
      navigate('/vendas');
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro ao salvar'); }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>{id ? 'Editar Venda' : 'Nova Venda'}</h2>
          <div style={{ maxWidth: '500px' }}>
            <Alert type="error" message={erro} />
            <form onSubmit={handleSubmit}>
              <Select label="Carro" value={form.carro_id} onChange={e=>setForm({...form, carro_id: e.target.value})} options={carros} required />
              <Input label="Comprador" value={form.comprador_nome} onChange={e=>setForm({...form, comprador_nome: e.target.value})} required />
              <Input label="CPF" value={form.comprador_cpf} onChange={e=>setForm({...form, comprador_cpf: e.target.value})} required />
              <Input label="Valor" type="number" step="0.01" value={form.valor_venda} onChange={e=>setForm({...form, valor_venda: e.target.value})} required />
              <Input label="Data" type="date" value={form.data_venda} onChange={e=>setForm({...form, data_venda: e.target.value})} required />
              <Button type="submit">Salvar</Button>{' '}
              <Button type="button" variant="secondary" onClick={() => navigate('/vendas')}>Cancelar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
