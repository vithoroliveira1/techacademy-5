import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Alert } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';

export function FormMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ nome: '', pais_origem: '' });
  const [erro, setErro] = useState('');
  
  useEffect(() => {
    if (id) api.get(`/marcas/${id}`).then(r => setForm(r.data)).catch(e => setErro('Erro ao carregar'));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!form.nome || !form.pais_origem) return setErro('Campos obrigatórios');
    try {
      if (id) await api.put(`/marcas/${id}`, form);
      else await api.post('/marcas', form);
      navigate('/marcas');
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro ao salvar'); }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>{id ? 'Editar Marca' : 'Nova Marca'}</h2>
          <div style={{ maxWidth: '500px' }}>
            <Alert type="error" message={erro} />
            <form onSubmit={handleSubmit}>
              <Input label="Nome" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required />
              <Input label="País de Origem" value={form.pais_origem} onChange={e=>setForm({...form, pais_origem: e.target.value})} required />
              <Button type="submit">Salvar</Button>{' '}
              <Button type="button" variant="secondary" onClick={() => navigate('/marcas')}>Cancelar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
