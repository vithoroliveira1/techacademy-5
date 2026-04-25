import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './layout.css';

export function Sidebar() {
  const loc = useLocation();
  const { usuario } = useAuth();
  
  const isDev = usuario?.role === 'developer';
  
  const menuDeveloper = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Marcas', path: '/marcas' },
    { label: 'Carros', path: '/carros' },
    { label: 'Vendas', path: '/vendas' },
    { label: 'Todos Aluguéis', path: '/alugueis/todos' },
    { label: 'Perfil', path: '/perfil' }
  ];
  
  const menuLead = [
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Meus Aluguéis', path: '/alugueis/meus' },
    { label: 'Perfil', path: '/perfil' }
  ];
  
  const menu = isDev ? menuDeveloper : menuLead;

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {menu.map(i => (
          <Link key={i.path} to={i.path} className={`nav-link ${loc.pathname.startsWith(i.path) ? 'active' : ''}`}>
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
