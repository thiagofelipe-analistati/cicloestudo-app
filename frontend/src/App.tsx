// src/App.tsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { SessaoEstudoModal } from './components/SessaoEstudoModal/SessaoEstudoModal';
import { ChronometerModal } from './components/ChronometerModal/ChronometerModal';
import styles from './App.module.css';
import type { Disciplina } from './services/disciplinaService';
import { getAllDisciplinas } from './services/disciplinaService';

function App() {
  const [isSessaoModalOpen, setIsSessaoModalOpen] = useState(false);
  const [isChronometerModalOpen, setIsChronometerModalOpen] = useState(false);
  
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [prefilledTime, setPrefilledTime] = useState(0);

  useEffect(() => {
    getAllDisciplinas().then(data => setDisciplinas(data));
  }, []);
  
  // Função que o cronômetro chama quando é parado
  const handleChronometerStop = (elapsedSeconds: number) => {
    setIsChronometerModalOpen(false); // Fecha o modal do cronômetro
    setPrefilledTime(elapsedSeconds); // Guarda o tempo
    setIsSessaoModalOpen(true);      // Abre o modal de registro
  };

  // Função para abrir o modal de registro manualmente
  const handleOpenSessaoModal = () => {
    setPrefilledTime(0); // Garante que o tempo não seja preenchido
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
      />
    </div>
  );
}
export default App;