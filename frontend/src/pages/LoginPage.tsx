// src/pages/LoginPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react'; // Correção 1
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { login as loginService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const { token } = await loginService({ email, password });
      login(token);
      navigate('/');
    } catch (err) {
      setError('Email ou senha inválidos. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login - AprovaFlow</h2>
        {/* Correção 2: O formulário agora usa as variáveis e funções */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
        <p className={styles.link}>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}