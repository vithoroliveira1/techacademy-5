import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Select, Alert } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Carro } from '../../types';

export function FormAluguel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCarroId = searchParams.get('carro_id') || '';

  const [form, setForm] = useState({ carro_id: initialCarroId, data_inicio: '', data_fim: '' });
  const [carros, setCarros] = useState<{label: string, value: number, preco: number}[]>([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [valorEstimado, setValorEstimado] = useState(0);

  useEffect(() => {
    // Carrega apenas os disponíveis
    api.get('/carros/disponiveis?limit=100').then(r => {
      setCarros(r.data.data.map((c: Carro) => ({ label: `${c.marca_nome} ${c.modelo} (R$${c.preco}/dia)`, value: c.id, preco: c.preco })));
    }).catch(() => setErro('Erro ao carregar veículos'));
  }, []);

  useEffect(() => {
    if (form.carro_id && form.data_inicio && form.data_fim) {
      const inicio = new Date(form.data_inicio);
      const fim = new Date(form.data_fim);
      if (fim > inicio) {
        const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 3600 * 24));
        const carro = carros.find(c => c.value === Number(form.carro_id));
        if (carro) setValorEstimado(dias * carro.preco);
      } else {
        setValorEstimado(0);
      }
    } else {
      setValorEstimado(0);
    }
  }, [form.carro_id, form.data_inicio, form.data_fim, carros]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (!form.carro_id || !form.data_inicio || !form.data_fim) return setErro('Preencha todos os campos');
    
    setLoading(true);
    try {
      await api.post('/alugueis', form);
      navigate('/alugueis/meus');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro ao processar aluguel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>Novo Aluguel</h2>
          <div style={{ maxWidth: '500px' }}>
            <Alert type="error" message={erro} />
            <form onSubmit={handleSubmit}>
              <Select 
                label="Carro" 
                value={form.carro_id} 
                onChange={e=>setForm({...form, carro_id: e.target.value})} 
                options={carros} 
                required 
              />
              <Input 
                label="Data de Início" 
                type="date" 
                value={form.data_inicio} 
                onChange={e=>setForm({...form, data_inicio: e.target.value})} 
                required 
              />
              <Input 
                label="Data de Devolução" 
                type="date" 
                value={form.data_fim} 
                onChange={e=>setForm({...form, data_fim: e.target.value})} 
                required 
              />
              
              {valorEstimado > 0 && (
                <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '6px', marginBottom: '1rem' }}>
                  <strong>Valor Estimado do Aluguel:</strong> R$ {valorEstimado.toFixed(2)}
                </div>
              )}

              <Button type="submit" loading={loading}>Confirmar Aluguel</Button>{' '}
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
