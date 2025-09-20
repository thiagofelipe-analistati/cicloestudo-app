// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import { useData } from '../contexts/DataContext';
import { KpiCard } from '../components/KpiCard/KpiCard';
import { DisciplinaSummaryPanel } from '../components/DisciplinaSummaryPanel/DisciplinaSummaryPanel';
import { CicloStatusChart } from "../components/CicloStatusChart/CicloStatusChart";
import type { SessaoEstudo } from '../services/sessaoService';
import { getAllSessoes } from '../services/sessaoService';
import type { DisciplinaSummary } from '../services/disciplinaService';
import { getDisciplinasSummary } from '../services/disciplinaService';
import type { CicloComProgresso } from '../services/cicloService';
import { getAllCiclosComProgresso } from '../services/cicloService';

// --- Função helper para formatar tempo ---
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

  // Agora usamos o refetchKey corretamente
  const { refetchKey } = useData();

  // --- Carregar dados do Dashboard ---
  useEffect(() => {
    setCarregando(true);
    const fetchDashboard = async () => {
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

    fetchDashboard();
  }, [refetchKey]); // ✅ Atualiza automaticamente

  // --- Cálculo de totais para KPIs ---
  const totais = sessoes.reduce(
    (acc, sessao) => {
      acc.tempo += sessao.tempoEstudado;
      acc.questoes += sessao.totalQuestoes || 0;
      acc.acertos += sessao.acertosQuestoes || 0;
      acc.erros += sessao.errosQuestoes || 0;
      return acc;
    },
    { tempo: 0, questoes: 0, acertos: 0, erros: 0 }
  );

  const percentualAcerto =
    totais.questoes > 0 ? (totais.acertos / totais.questoes) * 100 : 0;

  if (carregando) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>

      {/* KPIs principais */}
      <div className={styles.grid}>
        <KpiCard title="Tempo de Estudo" value={formatTime(totais.tempo)} />
        <KpiCard
          title="Desempenho"
          value={`${percentualAcerto.toFixed(1)}%`}
          details={
            <span>
              Certas: {totais.acertos} /{' '}
              <span className={styles.errorCount}>Erradas: {totais.erros}</span>
            </span>
          }
        />
        <KpiCard
          title="Progresso no Edital"
          value="-"
          details={<span>- Tópicos Concluídos</span>}
        />
        <KpiCard title="Sessões Realizadas" value={sessoes.length.toString()} />
      </div>

      {/* Painel geral + Ciclos */}
      <div className={styles.mainGrid}>
        <div className={styles.painelGeral}>
          <h2>Painel Geral</h2>
          <DisciplinaSummaryPanel summaryData={summary} />
        </div>

        <div className={styles.ciclosContainer}>
          {ciclos.length > 0 ? (
            ciclos.map((ciclo) => (
              <div key={ciclo.id} className={styles.cicloStatus}>
                <h2>{ciclo.nome}</h2>
                <CicloStatusChart cicloAtivo={ciclo} />
              </div>
            ))
          ) : (
            <div className={styles.noCiclo}>
              <h3>Nenhum Ciclo Cadastrado</h3>
              <p>
                Vá para a página de Planejamento para criar o seu primeiro ciclo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
