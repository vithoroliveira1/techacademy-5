import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Alert, Pagination } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Marca, ListaPaginada } from '../../types';
import { usePaginacao } from '../../hooks/usePaginacao';

export function ListaMarcas() {
  const navigate = useNavigate();
  const pag = usePaginacao();
  const [data, setData] = useState<ListaPaginada<Marca>>();
  const [erro, setErro] = useState('');

  async function carregar() {
    setErro('');
    try {
      const res = await api.get(`/marcas?page=${pag.page}&limit=${pag.limit}`);
      setData(res.data);
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro'); }
  }

  useEffect(() => { carregar(); }, [pag.page, pag.limit]);

  async function excluir(id: number) {
    if (!window.confirm('Excluir marca?')) return;
    try {
      await api.delete(`/marcas/${id}`);
      carregar();
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro ao excluir'); }
  }

  const renderRow = (item: Marca) => (
    <tr key={item.id}>
      <td>{item.id}</td><td>{item.nome}</td><td>{item.pais_origem}</td>
      <td>
        <Button variant="secondary" onClick={() => navigate(`/marcas/${item.id}/editar`)}>Editar</Button>{' '}
        <Button variant="danger" onClick={() => excluir(item.id)}>Excluir</Button>
      </td>
    </tr>
  );

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2>Marcas</h2>
            <Button onClick={() => navigate('/marcas/nova')}>Nova Marca</Button>
          </div>
          <Alert type="error" message={erro} />
          <Table headers={['ID', 'Nome', 'País', 'Ações']} data={data?.data || []} renderRow={renderRow} />
          <Pagination page={pag.page} totalPages={data?.paginacao.totalPages || 1} onPageChange={pag.setPage} />
        </main>
      </div>
    </div>
  );
}
