import React from 'react';
import { Header, Sidebar } from '../components/layout';

export function Dashboard() {
  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <h2>Dashboard</h2>
          <p>Bem-vindo ao Sistema de Compra de Carros.</p>
        </main>
      </div>
    </div>
  );
}
