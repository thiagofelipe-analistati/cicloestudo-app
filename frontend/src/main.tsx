// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import { RouterProvider } from 'react-router-dom'; // Importe o RouterProvider
import { router } from './routes/index.tsx';       // Importe o 'router'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { DataProvider } from './contexts/DataContext.tsx';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Os Providers agora envolvem o RouterProvider, garantindo que
        o contexto esteja disponível para TODAS as rotas, incluindo Login */}
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
);