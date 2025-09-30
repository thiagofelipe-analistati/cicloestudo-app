// ARQUIVO: frontend/src/App.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './App.module.css';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { SessaoEstudoModal } from './components/SessaoEstudoModal/SessaoEstudoModal';
import { ChronometerModal } from './components/ChronometerModal/ChronometerModal';
import { useData } from './contexts/DataContext';
import type { Revisao } from './services/revisaoService';

function App() {
  const [isSessaoModalOpen, setIsSessaoModalOpen] = useState(false);
  const [isChronometerModalOpen, setIsChronometerModalOpen] = useState(false);
  const [prefilledTime, setPrefilledTime] = useState(0);
  const [revisaoContext, setRevisaoContext] = useState<Revisao | null>(null);
  
  const { disciplinas, refetchData } = useData();

  const handleChronometerStop = (elapsedSeconds: number) => {
    setIsChronometerModalOpen(false);
    setPrefilledTime(elapsedSeconds);
    setIsSessaoModalOpen(true);
  };

  const handleOpenSessaoModal = () => {
    setPrefilledTime(0);
    setRevisaoContext(null); // Garante que é um estudo livre
    setIsSessaoModalOpen(true);
  };

  const handleStartChronometerForRevisao = (revisao: Revisao) => {
    setRevisaoContext(revisao);
    setIsChronometerModalOpen(true);
  };

  const handleRegisterRevisaoManual = (revisao: Revisao) => {
    setPrefilledTime(0);
    setRevisaoContext(revisao);
    setIsSessaoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSessaoModalOpen(false);
    setRevisaoContext(null); // Limpa o contexto ao fechar o modal
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header 
          onOpenChronometer={() => {
            setRevisaoContext(null); // Garante que o cronômetro livre não tenha contexto
            setIsChronometerModalOpen(true);
          }}
          onOpenNewStudySession={handleOpenSessaoModal}
        />
        <main className={styles.mainContent}>
          <Outlet context={{ handleStartChronometerForRevisao, handleRegisterRevisaoManual }} />
        </main>
      </div>
      
      <ChronometerModal 
        isOpen={isChronometerModalOpen}
        onRequestClose={() => setIsChronometerModalOpen(false)}
        onStop={handleChronometerStop}
      />

      <SessaoEstudoModal
        isOpen={isSessaoModalOpen}
        onRequestClose={handleCloseModal}
        disciplinas={disciplinas}
        initialTimeInSeconds={prefilledTime}
        onSessionSaved={refetchData}
        revisaoContext={revisaoContext}
      />
    </div>
  );
}
export default App;