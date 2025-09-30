// ARQUIVO: frontend/src/pages/RevisoesPage.tsx

import { useState, useEffect } from 'react';
import styles from './RevisoesPage.module.css';
import { getRevisoesPendentes, marcarRevisaoComoConcluida, type Revisao, type RevisoesResponse } from '../services/revisaoService';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FaPlay, FaEdit } from 'react-icons/fa';

interface RevisaoContextType {
  handleStartChronometerForRevisao: (revisao: Revisao) => void;
  handleRegisterRevisaoManual: (revisao: Revisao) => void;
}

// Funções utilitárias substituindo date-fns
const isToday = (date: Date) => {
  const hoje = new Date();
  return (
    date.getDate() === hoje.getDate() &&
    date.getMonth() === hoje.getMonth() &&
    date.getFullYear() === hoje.getFullYear()
  );
};

const isTomorrow = (date: Date) => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  return (
    date.getDate() === amanha.getDate() &&
    date.getMonth() === amanha.getMonth() &&
    date.getFullYear() === amanha.getFullYear()
  );
};

const formatarDataRevisao = (data: string) => {
  const dataObj = new Date(data);
  if (isToday(dataObj)) return 'Hoje';
  if (isTomorrow(dataObj)) return 'Amanhã';
  return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
};

export function RevisoesPage() {
  const [todasRevisoes, setTodasRevisoes] = useState<Revisao[]>([]);
  const [revisoesFiltradas, setRevisoesFiltradas] = useState<Revisao[]>([]);
  const [stats, setStats] = useState({ total: 0, atrasadas: 0, paraHoje: 0 });
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'atrasadas', 'hoje'

  const { handleStartChronometerForRevisao, handleRegisterRevisaoManual } = useOutletContext<RevisaoContextType>();
  const { refetchKey } = useData();

  useEffect(() => {
    const fetchRevisoes = async () => {
      setCarregando(true);
      try {
        const data: RevisoesResponse = await getRevisoesPendentes();
        setTodasRevisoes(data.revisoes);
        setRevisoesFiltradas(data.revisoes); 
        setStats(data.stats);
      } catch (error) {
        console.error("Falha ao buscar revisões", error);
      } finally {
        setCarregando(false);
      }
    };
    fetchRevisoes();
  }, [refetchKey]);

  useEffect(() => {
    let filtradas = todasRevisoes;
    if (filtro === 'atrasadas') {
      filtradas = todasRevisoes.filter(r => r.atrasada);
    } else if (filtro === 'hoje') {
      filtradas = todasRevisoes.filter(r => isToday(new Date(r.dataAgendada)));
    }
    setRevisoesFiltradas(filtradas);
  }, [filtro, todasRevisoes]);

  const handleConcluirRapido = async (revisaoId: string) => {
    try {
      await marcarRevisaoComoConcluida(revisaoId);
      setTodasRevisoes(prev => prev.filter(r => r.id !== revisaoId));
    } catch (error) {
      console.error("Falha ao concluir revisão", error);
      alert("Não foi possível concluir a revisão.");
    }
  };

  if (carregando) {
    return <div className={styles.container}>Carregando revisões...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Revisões Agendadas</h1>
      </header>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}><span>{stats.total}</span>Agendadas</div>
        <div className={`${styles.kpiCard} ${stats.atrasadas > 0 ? styles.kpiAtrasadas : ''}`}><span>{stats.atrasadas}</span>Atrasadas</div>
        <div className={styles.kpiCard}><span>{stats.paraHoje}</span>Para Hoje</div>
      </div>

      <div className={styles.filterBar}>
        <button onClick={() => setFiltro('todas')} className={filtro === 'todas' ? styles.activeFilter : ''}>Todas</button>
        <button onClick={() => setFiltro('atrasadas')} className={filtro === 'atrasadas' ? styles.activeFilter : ''}>Atrasadas</button>
        <button onClick={() => setFiltro('hoje')} className={filtro === 'hoje' ? styles.activeFilter : ''}>Hoje</button>
      </div>
      
      {revisoesFiltradas.length === 0 ? (
        <div className={styles.semRevisoes}>
          <h2>Nenhuma revisão encontrada!</h2>
          <p>{filtro === 'todas' ? 'Você está em dia com suas revisões.' : 'Nenhuma revisão corresponde a este filtro.'}</p>
        </div>
      ) : (
        <ul className={styles.revisoesList}>
          {revisoesFiltradas.map((revisao) => (
            <li key={revisao.id} className={`${styles.revisaoItem} ${revisao.atrasada ? styles.itemAtrasado : ''}`}>
              <div className={styles.info}>
                <span className={styles.data}>{formatarDataRevisao(revisao.dataAgendada)}</span>
                {revisao.atrasada && <span className={styles.avisoAtrasada}>ATRASADA</span>}
                <h3 className={styles.topicoNome}>{revisao.topico.nome}</h3>
                <p className={styles.disciplinaNome}>{revisao.topico.disciplina.nome}</p>
              </div>
              <div className={styles.actionsContainer}>
                <div className={styles.quickComplete}>
                  <input type="checkbox" id={`revisao-${revisao.id}`} className={styles.checkbox} onChange={() => handleConcluirRapido(revisao.id)} />
                  <label htmlFor={`revisao-${revisao.id}`}>Concluir</label>
                </div>
                <div className={styles.revisaoAcoes}>
                  <button onClick={() => handleRegisterRevisaoManual(revisao)} className={styles.acaoBtn} title="Registrar manualmente"><FaEdit /></button>
                  <button onClick={() => handleStartChronometerForRevisao(revisao)} className={`${styles.acaoBtn} ${styles.playBtn}`} title="Iniciar cronômetro"><FaPlay /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
