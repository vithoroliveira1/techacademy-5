import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function PrivateRoute({ children, allowedRoles }: Props) {
  const { token, usuario } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && usuario && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }
  
  return <>{children}</>;
}
