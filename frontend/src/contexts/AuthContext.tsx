// src/contexts/AuthContext.tsx
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

// ... (O resto do arquivo continua o mesmo)
// Cole o código completo abaixo para garantir

interface User { email: string; }
interface AuthContextType { user: User | null; login: (token: string) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem('aprova-flow-token', token);
    // Lógica para definir o usuário (ex: decodificando o token) viria aqui
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