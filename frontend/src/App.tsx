// src/App.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { SessaoEstudoModal } from './components/SessaoEstudoModal/SessaoEstudoModal';
import { ChronometerModal } from './components/ChronometerModal/ChronometerModal';
import styles from './App.module.css';
import { useData } from './contexts/DataContext';

function App() {
  const [isSessaoModalOpen, setIsSessaoModalOpen] = useState(false);
  const [isChronometerModalOpen, setIsChronometerModalOpen] = useState(false);
  const [prefilledTime, setPrefilledTime] = useState(0);
  
  // Pega os dados e a função de recarregar do nosso contexto global
  const { disciplinas, refetchData } = useData();

  const handleChronometerStop = (elapsedSeconds: number) => {
    setIsChronometerModalOpen(false);
    setPrefilledTime(elapsedSeconds);
    setIsSessaoModalOpen(true);
  };
  const handleOpenSessaoModal = () => {
    setPrefilledTime(0);
    setIsSessaoModalOpen(true);
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header 
          onOpenChronometer={() => setIsChronometerModalOpen(true)}
          onOpenNewStudySession={handleOpenSessaoModal}
        />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      
      <ChronometerModal 
        isOpen={isChronometerModalOpen}
        onRequestClose={() => setIsChronometerModalOpen(false)}
        onStop={handleChronometerStop}
      />

      <SessaoEstudoModal
        isOpen={isSessaoModalOpen}
        onRequestClose={() => setIsSessaoModalOpen(false)}
        disciplinas={disciplinas}
        initialTimeInSeconds={prefilledTime}
        onSessionSaved={refetchData}
      />
    </div>
  );
}
export default App;