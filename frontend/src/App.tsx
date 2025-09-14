// src/App.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}
export default App;