// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { DataProvider } from './contexts/DataContext.tsx';

Modal.setAppElement(document.getElementById('root')!);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DataProvider>
  </React.StrictMode>,
);

