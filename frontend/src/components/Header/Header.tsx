// src/components/Header/Header.tsx
import styles from './Header.module.css';
import logoAprovaFlow from '../../assets/logo.png'; // Importando a sua logo

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <img src={logoAprovaFlow} alt="Logo AprovaFlow" className={styles.logo} />
      
      <nav className={styles.navigation}>
        <a href="#" className={styles.navLink}>Painel</a>
        <a href="#" className={styles.navLink}>Histórico</a>
        <a href="#" className={styles.navLink}>Planejamento</a>
      </nav>
      
      <div className={styles.profileSection}>
        {/* Espaço para o ícone do perfil no futuro */}
        <span>Usuário</span>
      </div>
    </header>
  );
}