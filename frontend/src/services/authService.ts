// src/services/authService.ts
import api from './api';
// Usamos 'import type' porque estamos importando apenas tipos
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.ts';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await api.post('/auth/register', credentials);
};