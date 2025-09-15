// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

// No futuro, criaremos esta função no authService.ts
// import { getMe } from '../services/authService'; 

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (token: string) => void; // Adicionamos uma função de login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem('aprova-flow-token', token);
    // Aqui, no futuro, decodificaremos o token ou chamaremos a API para pegar os dados do usuário
    // Por enquanto, vamos simular:
    // const decodedUser = jwt_decode(token); // Exemplo com uma biblioteca jwt-decode
    // setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('aprova-flow-token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};