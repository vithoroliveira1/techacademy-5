import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Pagination } from '../../components/common';
import { Header, Sidebar } from '../../components/layout';
import { api } from '../../services/api';
import type { Aluguel, ListaPaginada } from '../../types';
import { usePaginacao } from '../../hooks/usePaginacao';

export function ListaAlugueis() {
  const pag = usePaginacao();
  const [data, setData] = useState<ListaPaginada<Aluguel>>();
  const [erro, setErro] = useState('');

  async function carregar() {
    setErro('');
    try {
      const res = await api.get(`/alugueis?page=${pag.page}&limit=${pag.limit}`);
      setData(res.data);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro ao carregar');
    }
  }

  useEffect(() => { carregar(); }, [pag.page, pag.limit]);

  async function finalizar(id: number) {
    if (!window.confirm('Finalizar este aluguel (o carro ficará disponível)?')) return;
    try {
      await api.put(`/alugueis/${id}/finalizar`);
      carregar();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErro(error.response?.data?.error || 'Erro ao finalizar');
    }
  }

  const renderRow = (item: Aluguel) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.usuario_id}</td>
      <td>{item.carro_marca} {item.carro_modelo}</td>
      <td>{new Date(item.data_inicio).toLocaleDateString('pt-BR')}</td>
      <td>R$ {item.valor_total}</td>
      <td>{item.status.toUpperCase()}</td>
      <td>
        {item.status === 'ativo' && (
          <Button variant="secondary" onClick={() => finalizar(item.id)}>Finalizar</Button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>Gestão de Aluguéis</h2>
          <Alert type="error" message={erro} />
          <Table 
            headers={['ID', 'ID Usuário', 'Carro', 'Início', 'Valor', 'Status', 'Ações']} 
            data={data?.data || []} 
            renderRow={renderRow} 
          />
          <Pagination page={pag.page} totalPages={data?.paginacao?.totalPages || 1} onPageChange={pag.setPage} />
        </main>
      </div>
    </div>
  );
}
