// src/services/api.ts
import axios from 'axios';

// Cria uma instância do axios pré-configurada
const api = axios.create({
  // A URL base de todas as requisições para o nosso back-end
  baseURL: 'http://localhost:3000/api',
});

export default api;