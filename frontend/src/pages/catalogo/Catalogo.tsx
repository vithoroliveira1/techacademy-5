import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Pagination } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Carro, ListaPaginada } from '../../types';
import { usePaginacao } from '../../hooks/usePaginacao';
import './catalogo.css';

export function Catalogo() {
  const navigate = useNavigate();
  const pag = usePaginacao(12); // Exibe 12 por página (grid)
  const [data, setData] = useState<ListaPaginada<Carro>>();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setErro('');
    setLoading(true);
    try {
      const res = await api.get(`/carros/disponiveis?page=${pag.page}&limit=${pag.limit}`);
      setData(res.data);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro ao carregar catálogo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [pag.page, pag.limit]);

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>Carros Disponíveis</h2>
          <p>Escolha o carro ideal para o seu próximo destino.</p>
          
          <Alert type="error" message={erro} />
          
          {loading ? (
             <p>Carregando catálogo...</p>
          ) : (
            <div className="catalogo-grid">
              {data?.data.length === 0 ? (
                <p>Nenhum carro disponível no momento.</p>
              ) : (
                data?.data.map(carro => (
                  <div key={carro.id} className="carro-card">
                    <div className="carro-card-header">
                      <h3>{carro.marca_nome} {carro.modelo}</h3>
                      <span className="carro-ano">{carro.ano}</span>
                    </div>
                    <div className="carro-card-body">
                      <p><strong>Cor:</strong> {carro.cor}</p>
                      <p className="carro-preco">R$ {carro.preco} <small>/ dia</small></p>
                    </div>
                    <div className="carro-card-footer">
                      <Button onClick={() => navigate(`/alugueis/novo?carro_id=${carro.id}`)} className="w-full">
                        Alugar Agora
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          <Pagination page={pag.page} totalPages={data?.paginacao?.totalPages || 1} onPageChange={pag.setPage} />
        </main>
      </div>
    </div>
  );
}
