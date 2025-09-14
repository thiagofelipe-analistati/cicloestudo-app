// src/components/Sidebar/Sidebar.tsx
import styles from './Sidebar.module.css';
import logoAprovaFlow from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Nova div para agrupar logo e navegação */}
      <div className={styles.topSection}> 
        <NavLink to="/" className={styles.logoLink}>
          <img src={logoAprovaFlow} alt="Logo AprovaFlow" className={styles.logo} />
        </NavLink>
        <nav>
          <ul>
            <li>
              <NavLink to="/disciplinas" className={({ isActive }) => isActive ? styles.active : ''}>
                Disciplinas
              </NavLink>
            </li>
            <li>
              <NavLink to="/historico" className={({ isActive }) => isActive ? styles.active : ''}>
                Histórico
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}