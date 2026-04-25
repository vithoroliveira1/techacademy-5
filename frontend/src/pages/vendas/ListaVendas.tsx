import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Alert, Pagination } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Venda, ListaPaginada } from '../../types';
import { usePaginacao } from '../../hooks/usePaginacao';

export function ListaVendas() {
  const navigate = useNavigate();
  const pag = usePaginacao();
  const [data, setData] = useState<ListaPaginada<Venda>>();
  const [erro, setErro] = useState('');

  async function carregar() {
    setErro('');
    try {
      const res = await api.get(`/vendas?page=${pag.page}&limit=${pag.limit}`);
      setData(res.data);
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro'); }
  }

  useEffect(() => { carregar(); }, [pag.page, pag.limit]);

  async function excluir(id: number) {
    if (!window.confirm('Excluir venda?')) return;
    try {
      await api.delete(`/vendas/${id}`);
      carregar();
    } catch (err: any) { setErro(err.response?.data?.error || 'Erro ao excluir'); }
  }

  const renderRow = (item: Venda) => (
    <tr key={item.id}>
      <td>{item.id}</td><td>{item.carro_id}</td><td>{item.comprador_nome}</td>
      <td>R$ {item.valor_venda}</td><td>{new Date(item.data_venda).toLocaleDateString('pt-BR')}</td>
      <td>
        <Button variant="secondary" onClick={() => navigate(`/vendas/${item.id}/editar`)}>Editar</Button>{' '}
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
            <h2>Vendas</h2>
            <Button onClick={() => navigate('/vendas/nova')}>Nova Venda</Button>
          </div>
          <Alert type="error" message={erro} />
          <Table headers={['ID', 'ID Carro', 'Comprador', 'Valor', 'Data', 'Ações']} data={data?.data || []} renderRow={renderRow} />
          <Pagination page={pag.page} totalPages={data?.paginacao?.totalPages || 1} onPageChange={pag.setPage} />
        </main>
      </div>
    </div>
  );
}
