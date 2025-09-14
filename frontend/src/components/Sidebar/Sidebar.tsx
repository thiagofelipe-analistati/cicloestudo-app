// src/components/Sidebar/Sidebar.tsx
import styles from './Sidebar.module.css';
import logoAprovaFlow from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';

// O Sidebar não precisa mais receber propriedades
export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <NavLink to="/">
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
      {/* O botão foi removido daqui */}
    </aside>
  );
}