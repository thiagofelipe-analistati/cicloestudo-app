// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // O Vite irá injetar a URL correta aqui dependendo do ambiente
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// O interceptador continua o mesmo...
api.interceptors.request.use(config => {
  const token = localStorage.getItem('aprova-flow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;