// src/components/Header/Header.tsx
import styles from './Header.module.css';
import { FaPlay } from 'react-icons/fa';

interface HeaderProps {
  onOpenChronometer: () => void;
  onOpenNewStudySession: () => void;
}

export function Header({ onOpenChronometer, onOpenNewStudySession }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <span>Olá, Concurseiro!</span>
      </div>
      
      <div className={styles.actionsContainer}>
        <button className={styles.chronometerButton} onClick={onOpenChronometer}>
          <FaPlay />
          <span>Cronômetro</span>
        </button>

        <button className={styles.addStudyButton} onClick={onOpenNewStudySession}>
          Adicionar Estudo
        </button>
      </div>
    </header>
  );
}