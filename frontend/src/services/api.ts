// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // Em produção, ele usará a URL do .env. Em desenvolvimento, usará localhost.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// "Interceptador": antes de CADA requisição, ele executa esta função.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('aprova-flow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;