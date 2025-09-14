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

  // Estado para controlar a atualização dos dados nas páginas filhas
  const [dataKey, setDataKey] = useState(0);

  // Função que os componentes filhos chamarão para sinalizar uma atualização
  const refetchData = () => {
    setDataKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    getAllDisciplinas().then(data => setDisciplinas(data));
  }, []);
  
  const handleChronometerStop = (elapsedSeconds: number) => {
    setIsChronometerModalOpen(false);
    setPrefilledTime(elapsedSeconds);
    setIsSessaoModalOpen(true);
  };

  const handleOpenSessaoModal = () => {
    setPrefilledTime(0);
    setIsSessaoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSessaoModalOpen(false);
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
          {/* Passamos a chave de atualização para todas as páginas via 'context' do Outlet */}
          <Outlet context={{ refetchKey: dataKey }} />
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
        onSessionSaved={refetchData} // <-- Passa a função de recarregar para o modal
      />
    </div>
  );
}
export default App;