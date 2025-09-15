// src/pages/RegisterPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react'; // Correção 1
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { register } from '../services/authService';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await register({ email, password });
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Cadastro - AprovaFlow</h2>
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
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit">Cadastrar</button>
        </form>
        <p className={styles.link}>
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>
      </div>
    </div>
  );
}