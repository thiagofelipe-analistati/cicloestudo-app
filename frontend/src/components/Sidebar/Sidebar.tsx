import { useState } from 'react';
import styles from './Sidebar.module.css';
import logoAprovaFlow from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(prev => !prev);

  return (
    <>
      {/* Botão hambúrguer */}
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.topSection}>
          <NavLink to="/" className={styles.logoLink} onClick={() => setOpen(false)}>
            <img src={logoAprovaFlow} alt="Logo AprovaFlow" className={styles.logo} />
          </NavLink>
          <nav>
            <ul>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/disciplinas" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Disciplinas</NavLink>
              </li>
              <li>
                <NavLink to="/historico" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Histórico</NavLink>
              </li>
              <li>
                <NavLink to="/planejamento" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Planejamento</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
