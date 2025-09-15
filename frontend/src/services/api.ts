// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// "Interceptador": antes de CADA requisição, ele executa esta função.
api.interceptors.request.use(config => {
  // 1. Pega o token do localStorage
  const token = localStorage.getItem('aprova-flow-token');
  
  // 2. Se o token existir, anexa ao cabeçalho de autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 3. Retorna a configuração modificada para a requisição continuar
  return config;
});

export default api;