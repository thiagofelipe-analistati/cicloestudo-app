// src/components/Header/Header.tsx
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { FaPlay, FaUserCircle } from 'react-icons/fa'; // Importe o ícone de usuário
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onOpenChronometer: () => void;
  onOpenNewStudySession: () => void;
}

export function Header({ onOpenChronometer, onOpenNewStudySession }: HeaderProps) {
  const { user, logout } = useAuth();
  
  // Estado para controlar se o menu dropdown está aberto ou fechado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o dropdown se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <header className={styles.header}>
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
        
        {/* --- NOVO MENU DE USUÁRIO --- */}
        <div className={styles.profileMenu} ref={dropdownRef}>
          <button className={styles.profileButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <FaUserCircle size={24} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button onClick={logout} className={styles.dropdownItem}>
                Sair
              </button>
              {/* Outras opções como "Minha Conta" podem ser adicionadas aqui */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}