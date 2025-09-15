// src/components/Header/Header.tsx
import styles from './Header.module.css';
import { FaPlay } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Importe o hook

interface HeaderProps {
  onOpenChronometer: () => void;
  onOpenNewStudySession: () => void;
}

export function Header({ onOpenChronometer, onOpenNewStudySession }: HeaderProps) {
  const { user, logout } = useAuth(); // Use o hook para pegar o usuário e a função de logout

  return (
    <header className={styles.header}>
      {/* Agora exibe o email do usuário ou um texto padrão */}
      <div className={styles.userInfo}>
        <span>Olá, {user?.email || 'Concurseiro'}!</span>
      </div>
      
      <div className={styles.actionsContainer}>
        <button className={styles.chronometerButton} onClick={onOpenChronometer}>
          <FaPlay />
          <span>Cronômetro</span>
        </button>

        <button className={styles.addStudyButton} onClick={onOpenNewStudySession}>
          Adicionar Estudo
        </button>
        
        {/* Adicionamos um botão de logout */}
        <button onClick={logout} className={styles.logoutButton}>Sair</button>
      </div>
    </header>
  );
}