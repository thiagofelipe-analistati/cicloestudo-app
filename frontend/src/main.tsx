// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes' // Importa nosso sistema de rotas

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes /> {/* Diz ao React para renderizar nossas rotas */}
  </React.StrictMode>,
)