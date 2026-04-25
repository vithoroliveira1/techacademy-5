import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { useAuth } from './hooks/useAuth';

import { Login } from './pages/auth/Login';
import { Cadastro } from './pages/auth/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { EditarPerfil } from './pages/usuario/EditarPerfil';
import { AcessoNegado } from './pages/AcessoNegado';

import { ListaMarcas } from './pages/marcas/ListaMarcas';
import { FormMarca } from './pages/marcas/FormMarca';
import { ListaCarros } from './pages/carros/ListaCarros';
import { FormCarro } from './pages/carros/FormCarro';
import { ListaVendas } from './pages/vendas/ListaVendas';
import { FormVenda } from './pages/vendas/FormVenda';

import { Catalogo } from './pages/catalogo/Catalogo';
import { ListaAlugueis } from './pages/alugueis/ListaAlugueis';
import { MeusAlugueis } from './pages/alugueis/MeusAlugueis';
import { FormAluguel } from './pages/alugueis/FormAluguel';

// Componente para redirecionar a raiz baseado no role
function HomeRedirect() {
  const { usuario, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (usuario?.role === 'developer') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/catalogo" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />
          
          {/* Rota Raiz Dinâmica */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Rotas Comuns (Lead + Developer) */}
          <Route path="/perfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
          <Route path="/catalogo" element={<PrivateRoute><Catalogo /></PrivateRoute>} />
          <Route path="/alugueis/meus" element={<PrivateRoute><MeusAlugueis /></PrivateRoute>} />
          <Route path="/alugueis/novo" element={<PrivateRoute><FormAluguel /></PrivateRoute>} />

          {/* Rotas Exclusivas de Developer */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['developer']}><Dashboard /></PrivateRoute>} />
          
          <Route path="/marcas" element={<PrivateRoute allowedRoles={['developer']}><ListaMarcas /></PrivateRoute>} />
          <Route path="/marcas/nova" element={<PrivateRoute allowedRoles={['developer']}><FormMarca /></PrivateRoute>} />
          <Route path="/marcas/:id/editar" element={<PrivateRoute allowedRoles={['developer']}><FormMarca /></PrivateRoute>} />
          
          <Route path="/carros" element={<PrivateRoute allowedRoles={['developer']}><ListaCarros /></PrivateRoute>} />
          <Route path="/carros/novo" element={<PrivateRoute allowedRoles={['developer']}><FormCarro /></PrivateRoute>} />
          <Route path="/carros/:id/editar" element={<PrivateRoute allowedRoles={['developer']}><FormCarro /></PrivateRoute>} />
          
          <Route path="/vendas" element={<PrivateRoute allowedRoles={['developer']}><ListaVendas /></PrivateRoute>} />
          <Route path="/vendas/nova" element={<PrivateRoute allowedRoles={['developer']}><FormVenda /></PrivateRoute>} />
          <Route path="/vendas/:id/editar" element={<PrivateRoute allowedRoles={['developer']}><FormVenda /></PrivateRoute>} />
          
          <Route path="/alugueis/todos" element={<PrivateRoute allowedRoles={['developer']}><ListaAlugueis /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
