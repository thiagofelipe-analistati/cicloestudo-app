// src/components/Sidebar/Sidebar.tsx
import styles from './Sidebar.module.css';
import logoAprovaFlow from '../../assets/logo.png';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <img src={logoAprovaFlow} alt="Logo AprovaFlow" className={styles.logo} />
      <nav>
        <ul>
          <li>
            {/* No futuro, usaremos <Link> do react-router-dom aqui */}
            <a href="#" className={styles.active}>Disciplinas</a>
          </li>
          {/* Outros links do menu virão aqui */}
        </ul>
      </nav>
    </aside>
  );
}