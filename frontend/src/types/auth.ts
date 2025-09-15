// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}

export interface AuthResponse {
  token: string;
}