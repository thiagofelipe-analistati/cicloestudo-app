// src/services/authService.ts
import api from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

// Criamos um novo arquivo de tipos para organizar melhor
// Você pode criar um arquivo 'src/types/auth.ts' e colocar essas interfaces lá
// export interface LoginCredentials { ... }

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await api.post('/auth/register', credentials);
};