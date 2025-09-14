// src/components/Sidebar/Sidebar.tsx
import styles from './Sidebar.module.css';
import logoAprovaFlow from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
     <NavLink to="/" className={styles.logoLink}> 
        <img src={logoAprovaFlow} alt="Logo AprovaFlow" className={styles.logo} />
      </NavLink>
      
      <nav>
        <ul>
          <li>
            {/* AQUI ESTÁ A MUDANÇA: O 'to' agora aponta para "/disciplinas" */}
            <NavLink 
              to="/disciplinas" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Disciplinas
            </NavLink>
          </li>
          {/* Futuros links virão aqui, ex: <NavLink to="/planejamento">... */}
        </ul>
      </nav>
    </aside>
  );
}