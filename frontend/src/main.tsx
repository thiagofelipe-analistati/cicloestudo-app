// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import { AppRoutes } from './routes/index.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { DataProvider } from './contexts/DataContext.tsx';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O AuthProvider deve envolver tudo que precisa de autenticação */}
    <AuthProvider>
      {/* O DataProvider deve envolver tudo que precisa dos dados */}
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
);