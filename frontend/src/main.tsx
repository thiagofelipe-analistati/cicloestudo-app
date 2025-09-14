// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal';
import './index.css'
import { AppRoutes } from './routes' // Importa nosso sistema de rotas

Modal.setAppElement('#root'); 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes /> {/* Diz ao React para renderizar nossas rotas */}
  </React.StrictMode>,
)