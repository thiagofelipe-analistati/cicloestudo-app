// src/components/Header/Header.tsx
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { FaPlay, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onOpenChronometer: () => void;
  onOpenNewStudySession: () => void;
}

export function Header({ onOpenChronometer, onOpenNewStudySession }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    logout(); // limpa user e redireciona para /login
  };

  return (
    <header className={styles.header}>
 

      <div className={styles.actionsContainer}>
        <button className={styles.chronometerButton} onClick={onOpenChronometer}>
          <FaPlay />
          <span>Cronômetro</span>
        </button>

        <button className={styles.addStudyButton} onClick={onOpenNewStudySession}>
          Adicionar Estudo
        </button>

        <div className={styles.profileMenu} ref={dropdownRef}>
          <button className={styles.profileButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <FaUserCircle size={24} />
          </button>
        
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
