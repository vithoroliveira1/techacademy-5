import React from 'react';
import { Button } from './Button';
import './common.css';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination-container">
      <Button variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Anterior</Button>
      <span className="pagination-text">Página {page} de {totalPages}</span>
      <Button variant="secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Próximo</Button>
    </div>
  );
}
