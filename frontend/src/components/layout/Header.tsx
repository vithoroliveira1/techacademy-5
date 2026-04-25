import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './layout.css';

export function Header() {
  const { usuario, logout } = useAuth();
  
  const roleBadge = usuario?.role === 'developer' ? 'Admin' : 'Cliente';
  const roleClass = usuario?.role === 'developer' ? 'badge-dev' : 'badge-lead';
  
  return (
    <header className="header">
      <div className="header-logo">Car System</div>
      <div className="header-user">
        {usuario && <span className={`badge ${roleClass}`}>{roleBadge}</span>}
        <span>{usuario?.nome}</span>
        <button onClick={logout} className="logout-btn">Sair</button>
      </div>
    </header>
  );
}
