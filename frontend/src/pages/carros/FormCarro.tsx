import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Select, Alert } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Marca } from '../../types';

export function FormCarro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ modelo: '', ano: '', preco: '', cor: '', marca_id: '' });
  const [marcas, setMarcas] = useState<{label: string, value: number}[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/marcas?limit=100').then(r => setMarcas(r.data.data.map((m: Marca) => ({ label: m.nome, value: m.id }))));
    if (id) api.get(`/carros/${id}`).then(r => setForm(r.data)).catch(e => setErro('Erro ao carregar'));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!form.modelo || !form.ano || !form.preco || !form.cor || !form.marca_id) return setErro('Campos obrigatórios');
    try {
      if (id) await api.put(`/carros/${id}`, form);
      else await api.post('/carros', form);
      navigate('/carros');
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro ao salvar'); }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>{id ? 'Editar Carro' : 'Novo Carro'}</h2>
          <div style={{ maxWidth: '500px' }}>
            <Alert type="error" message={erro} />
            <form onSubmit={handleSubmit}>
              <Select label="Marca" value={form.marca_id} onChange={e=>setForm({...form, marca_id: e.target.value})} options={marcas} required />
              <Input label="Modelo" value={form.modelo} onChange={e=>setForm({...form, modelo: e.target.value})} required />
              <Input label="Ano" type="number" value={form.ano} onChange={e=>setForm({...form, ano: e.target.value})} required />
              <Input label="Preço" type="number" step="0.01" value={form.preco} onChange={e=>setForm({...form, preco: e.target.value})} required />
              <Input label="Cor" value={form.cor} onChange={e=>setForm({...form, cor: e.target.value})} required />
              <Button type="submit">Salvar</Button>{' '}
              <Button type="button" variant="secondary" onClick={() => navigate('/carros')}>Cancelar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
