// src/pages/HistoricoPage.tsx
import { useState, useEffect } from 'react';
import styles from './HistoricoPage.module.css';
import { useData } from '../contexts/DataContext'; // <-- 1. USA O NOVO CONTEXTO
import type { SessaoEstudo } from '../services/sessaoService';
import { getAllSessoes } from '../services/sessaoService';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00h00min";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}min`;
};

const formatDate = (dateValue: Date | string) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export function HistoricoPage() {
  const [sessoes, setSessoes] = useState<SessaoEstudo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filters, setFilters] = useState({
    disciplinaId: '',
    dataInicio: '',
    dataFim: '',
  });
  
  // 2. PEGA OS DADOS E A CHAVE DE ATUALIZAÇÃO DO CONTEXTO GLOBAL
  const { disciplinas, refetchKey } = useData();

  // Este useEffect agora reage aos filtros e à chave de atualização global
  useEffect(() => {
    setCarregando(true);
    const params: any = {};
    if (filters.disciplinaId) params.disciplinaId = filters.disciplinaId;
    if (filters.dataInicio) params.dataInicio = filters.dataInicio;
    if (filters.dataFim) params.dataFim = filters.dataFim;
    
    getAllSessoes(params)
      .then(setSessoes)
      .catch(err => console.error("Erro ao buscar sessões:", err))
      .finally(() => setCarregando(false));
      
  }, [filters, refetchKey]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value }));
  }

  const totais = sessoes.reduce((acc, sessao) => {
    acc.tempo += sessao.tempoEstudado;
    acc.questoes += sessao.totalQuestoes || 0;
    acc.acertos += sessao.acertosQuestoes || 0;
    acc.erros += sessao.errosQuestoes || 0;
    return acc;
  }, { tempo: 0, questoes: 0, acertos: 0, erros: 0 });

  const percentualAcerto = totais.questoes > 0 
    ? (totais.acertos / totais.questoes) * 100 
    : 0;
  
  return (
    <div className={styles.container}>
      <h1>Histórico de Estudos</h1>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Tempo de Estudo</h3>
          <p>{formatTime(totais.tempo)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Desempenho</h3>
          <p>{percentualAcerto.toFixed(1)}%</p>
          <div className={styles.performanceDetails}>
            <span>Certas: {totais.acertos}</span>
            <span>/</span>
            <span className={styles.errorCount}>Erradas: {totais.erros}</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Sessões Realizadas</h3>
          <p>{sessoes.length}</p>
        </div>
      </div>
      <div className={styles.filters}>
        <select name="disciplinaId" value={filters.disciplinaId} onChange={handleFilterChange}>
          <option value="">Todas as Disciplinas</option>
          {/* A lista de disciplinas agora vem do contexto, sempre atualizada! */}
          {disciplinas.map(d => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        <input name="dataInicio" type="date" value={filters.dataInicio} onChange={handleFilterChange} />
        <input name="dataFim" type="date" value={filters.dataFim} onChange={handleFilterChange} />
      </div>

      <div className={styles.sessionList}>
        {carregando ? (
          <p>Carregando histórico...</p>
        ) : sessoes.length === 0 ? (
          <p>Nenhuma sessão de estudo encontrada.</p>
        ) : (
          sessoes.map(sessao => (
            <div key={sessao.id} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h4>{formatDate(sessao.data)} - {sessao.disciplina.nome}</h4>
                <span>{sessao.topico?.nome}</span>
              </div>
              <div className={styles.sessionDetails}>
                <span><strong>Tempo:</strong> {formatTime(sessao.tempoEstudado)}</span>
                {sessao.totalQuestoes && sessao.totalQuestoes > 0 ? (
                  <span><strong>Questões:</strong> {sessao.acertosQuestoes}/{sessao.totalQuestoes}</span>
                ) : null}
                <span><strong>Categoria:</strong> {sessao.categoria}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}