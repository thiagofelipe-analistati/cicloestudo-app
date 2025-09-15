// src/pages/LoginPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { login as loginService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext'; // 1. Importe o hook useAuth

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // 2. Pegue a função de login do nosso contexto
  const { login } = useAuth(); 

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      // Chama o serviço da API para verificar as credenciais
      const { token } = await loginService({ email, password });
      
      // 3. Se a API retornou um token, chama a função 'login' do contexto
      // Esta função irá salvar o token no localStorage E atualizar o estado global
      login(token); 
      
      navigate('/'); // Redireciona para o Dashboard
    } catch (err) {
      setError('Email ou senha inválidos. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login - AprovaFlow</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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