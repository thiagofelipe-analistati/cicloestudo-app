// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('aprova-flow-token');

  // Se o token existe, renderiza a página filha (via Outlet).
  // Se não, redireciona para a página de login.
  return token ? <Outlet /> : <Navigate to="/login" />;
};