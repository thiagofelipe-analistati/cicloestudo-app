// ARQUIVO: frontend/src/pages/DashboardPage.tsx

import { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import { useData } from '../contexts/DataContext';
import { KpiCard } from '../components/KpiCard/KpiCard';
import { DisciplinaSummaryPanel } from '../components/DisciplinaSummaryPanel/DisciplinaSummaryPanel';
import { CicloStatusChart } from '../components/CicloStatusChart/CicloStatusChart';
import type { SessaoEstudo } from '../services/sessaoService';
import { getAllSessoes } from '../services/sessaoService';
import type { DisciplinaSummary } from '../services/disciplinaService';
import { getDisciplinasSummary } from '../services/disciplinaService';
import type { CicloComProgresso } from '../services/cicloService';
import { getAllCiclosComProgresso } from '../services/cicloService';
import { NavLink, useOutletContext } from 'react-router-dom';
import { getRevisoesDeHoje, type Revisao } from '../services/revisaoService';
import { FaPlay, FaEdit } from 'react-icons/fa';

interface DashboardContextType {
  handleStartChronometerForRevisao: (revisao: Revisao) => void;
  handleRegisterRevisaoManual: (revisao: Revisao) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00h00min";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}min`;
};

export function DashboardPage() {
  const [sessoes, setSessoes] = useState<SessaoEstudo[]>([]);
  const [summary, setSummary] = useState<DisciplinaSummary[]>([]);
  const [ciclos, setCiclos] = useState<CicloComProgresso[]>([]);
  const [revisoesHoje, setRevisoesHoje] = useState<Revisao[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const { refetchKey } = useData();
  const { handleStartChronometerForRevisao, handleRegisterRevisaoManual } = useOutletContext<DashboardContextType>();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setCarregando(true);
      try {
        const [sessoesData, summaryData, ciclosData, revisoesHojeData] = await Promise.all([
          getAllSessoes({}),
          getDisciplinasSummary(),
          getAllCiclosComProgresso(),
          getRevisoesDeHoje(),
        ]);
        setSessoes(sessoesData);
        setSummary(summaryData);
        setCiclos(ciclosData);
        setRevisoesHoje(revisoesHojeData);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
      } finally {
        setCarregando(false);
      }
    };
    fetchDashboardData();
  }, [refetchKey]);

  const totais = sessoes.reduce((acc, sessao) => {
    acc.tempo += sessao.tempoEstudado || 0;
    acc.questoes += sessao.totalQuestoes || 0;
    acc.acertos += sessao.acertosQuestoes || 0;
    acc.erros += sessao.errosQuestoes || 0;
    return acc;
  }, { tempo: 0, questoes: 0, acertos: 0, erros: 0 });

  const percentualAcerto = totais.questoes > 0 ? (totais.acertos / totais.questoes) * 100 : 0;

  if (carregando) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        <KpiCard title="Tempo de Estudo" value={formatTime(totais.tempo)} />
        <KpiCard
          title="Desempenho"
          value={`${percentualAcerto.toFixed(1)}%`}
          details={<span>Certas: {totais.acertos} / <span className={styles.errorCount}>Erradas: {totais.erros}</span></span>}
        />
        <KpiCard title="Sessões Realizadas" value={sessoes.length.toString()} />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.revisoesHojeContainer}>
            <div className={styles.revisoesHeader}>
              <h2>Revisões para Hoje</h2>
              {revisoesHoje.length > 3 && <NavLink to="/revisoes" className={styles.verTodasLink}>Ver todas</NavLink>}
            </div>
            {revisoesHoje.length > 0 ? (
              <ul className={styles.revisoesList}>
                {revisoesHoje.map((revisao) => (
                  <li key={revisao.id} className={styles.revisaoItem}>
                    <div className={styles.revisaoInfo}>
                      <strong>{revisao.topico.nome}</strong>
                      <p>{revisao.topico.disciplina.nome}</p>
                    </div>
                    <div className={styles.revisaoAcoes}>
                      <button onClick={() => handleRegisterRevisaoManual(revisao)} className={styles.acaoBtn} title="Registrar manualmente"><FaEdit /></button>
                      <button onClick={() => handleStartChronometerForRevisao(revisao)} className={`${styles.acaoBtn} ${styles.playBtn}`} title="Iniciar cronômetro"><FaPlay /></button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.semRevisoes}>Nenhuma revisão para hoje. Bom descanso!</p>
            )}
          </div>
          
          <div className={styles.painelGeral}>
            <h2>Painel Geral</h2>
            <DisciplinaSummaryPanel summaryData={summary} />
          </div>
        </div>

        {/* =============================================================== */}
        {/* AJUSTE APLICADO AQUI: A estrutura da coluna da direita foi alterada */}
        <div className={styles.rightColumn}>
          <h2 className={styles.columnTitle}>Progresso dos Ciclos</h2>
          
          {ciclos.length > 0 ? (
            ciclos.map(ciclo => (
              <div key={ciclo.id} className={styles.cicloCard}>
                <CicloStatusChart cicloAtivo={ciclo} />
              </div>
            ))
          ) : (
            <div className={styles.cicloCard}>
              <div className={styles.noCiclo}>
                <h3>Nenhum Ciclo Cadastrado</h3>
                <p>
                  <NavLink to="/planejamento">
                    <span className={styles.link}>Clique aqui</span>
                  </NavLink> para criar seu primeiro ciclo.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* FIM DO AJUSTE */}
        {/* =============================================================== */}

      </div>
    </div>
  );
}