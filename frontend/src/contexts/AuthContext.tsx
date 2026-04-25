import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { UsuarioResponse, UsuarioLogin } from '../types';

interface AuthContextData {
  usuario: UsuarioResponse | null;
  token: string | null;
  login: (dados: UsuarioLogin) => Promise<void>;
  logout: () => void;
  carregarPerfil: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('@CarSystem:token'));

  async function carregarPerfil() {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/perfil');
      setUsuario(data);
      localStorage.setItem('@CarSystem:user', JSON.stringify(data));
    } catch { logout(); }
  }

  useEffect(() => {
    const saved = localStorage.getItem('@CarSystem:user');
    if (saved && token) setUsuario(JSON.parse(saved));
    else if (token) carregarPerfil();
  }, [token]);

  async function login(dados: UsuarioLogin) {
    const { data } = await api.post('/auth/login', dados);
    setToken(data.token);
    localStorage.setItem('@CarSystem:token', data.token);
    await carregarPerfil();
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('@CarSystem:token');
    localStorage.removeItem('@CarSystem:user');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, carregarPerfil }}>{children}</AuthContext.Provider>
  );
};
