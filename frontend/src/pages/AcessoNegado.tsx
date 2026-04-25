import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';

export function AcessoNegado() {
  return (
    <div className="auth-container" style={{ textAlign: 'center' }}>
      <div className="auth-card">
        <h2>Acesso Negado</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Você não tem permissão para acessar esta página.
        </p>
        <Link to="/">
          <Button className="w-full">Voltar para o início</Button>
        </Link>
      </div>
    </div>
  );
}
