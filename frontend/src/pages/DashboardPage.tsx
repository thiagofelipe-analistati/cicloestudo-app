// src/pages/DashboardPage.tsx

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
import { NavLink } from 'react-router-dom';

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
  const [carregando, setCarregando] = useState(true);
  
  // AJUSTE 1: Pegar o `refetchKey` do contexto em vez de `refetchData`.
  const { refetchKey } = useData();

  // Função que busca todos os dados do dashboard
  const fetchDashboardData = async () => {
    setCarregando(true);
    try {
      const [sessoesData, summaryData, ciclosData] = await Promise.all([
        getAllSessoes({}),
        getDisciplinasSummary(),
        getAllCiclosComProgresso()
      ]);
      setSessoes(sessoesData);
      setSummary(summaryData);
      setCiclos(ciclosData);
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
    } finally {
      setCarregando(false);
    }
  };

  // AJUSTE 2: Usar `refetchKey` como dependência para disparar a atualização.
  useEffect(() => {
    fetchDashboardData();
  }, [refetchKey]);

  const totais = sessoes.reduce((acc, sessao) => {
    acc.tempo += sessao.tempoEstudado;
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
        <div className={styles.painelGeral}>
          <h2>Painel Geral</h2>
          <DisciplinaSummaryPanel summaryData={summary} />
        </div>

        <div className={styles.ciclosContainer}>
          <h2>Progresso dos Ciclos</h2>
          {ciclos.length > 0 ? (
            ciclos.map(ciclo => (
              <CicloStatusChart key={ciclo.id} cicloAtivo={ciclo} />
            ))
          ) : (
            <div className={styles.noCiclo}>
              <h3>Nenhum Ciclo Cadastrado</h3>
              <p>
                               <NavLink to="/planejamento" className={({ isActive }) => isActive ? styles.active : ''}>
                <span className={styles.link}>  Clique  aqui</span>
              </NavLink>  para criar seu primeiro ciclo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}