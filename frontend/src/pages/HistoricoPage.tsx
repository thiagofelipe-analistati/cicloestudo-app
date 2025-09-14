// src/pages/HistoricoPage.tsx
import { useState, useEffect } from 'react';
import styles from './HistoricoPage.module.css';
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas } from '../services/disciplinaService';
import type { SessaoEstudo } from '../services/sessaoService';
import { getAllSessoes } from '../services/sessaoService';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const formatDate = (dateValue: Date | string) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export function HistoricoPage() {
  const [sessoes, setSessoes] = useState<SessaoEstudo[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [filters, setFilters] = useState({
    disciplinaId: '',
    dataInicio: '',
    dataFim: '',
  });

  const fetchSessoes = async () => {
    setCarregando(true);
    try {
      const params: any = {};
      if (filters.disciplinaId) params.disciplinaId = filters.disciplinaId;
      if (filters.dataInicio) params.dataInicio = filters.dataInicio;
      if (filters.dataFim) params.dataFim = filters.dataFim;
      
      const fetchedSessoes = await getAllSessoes(params);
      setSessoes(fetchedSessoes);
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    getAllDisciplinas().then(setDisciplinas);
  }, []);

  useEffect(() => {
    fetchSessoes();
  }, [filters]);

  const totalTempoEstudado = sessoes.reduce((acc, sessao) => acc + sessao.tempoEstudado, 0);

  // Lógica do Desempenho atualizada para incluir erros
  const totaisQuestoes = sessoes.reduce((acc, sessao) => {
    acc.questoes += sessao.totalQuestoes || 0;
    acc.acertos += sessao.acertosQuestoes || 0;
    acc.erros += sessao.errosQuestoes || 0; // <-- Adicionado cálculo de erros
    return acc;
  }, { questoes: 0, acertos: 0, erros: 0 }); // <-- Adicionado erros ao objeto inicial

  const percentualAcerto = totaisQuestoes.questoes > 0 
    ? (totaisQuestoes.acertos / totaisQuestoes.questoes) * 100 
    : 0;

  if (carregando) return <div className={styles.container}>Carregando histórico...</div>;

  return (
    <div className={styles.container}>
      <h1>Histórico de Estudos</h1>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Tempo de Estudo</h3>
          <p>{formatTime(totalTempoEstudado)}</p>
        </div>

        <div className={styles.summaryCard}>
          <h3>Desempenho</h3>
          <p>{percentualAcerto.toFixed(1)}%</p>
          {/* Detalhes de acertos e erros adicionados aqui */}
          <div className={styles.performanceDetails}>
            <span>Certas: {totaisQuestoes.acertos}</span>
            <span>/</span>
            <span className={styles.errorCount}>Erradas: {totaisQuestoes.erros}</span>
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Sessões Realizadas</h3>
          <p>{sessoes.length}</p>
        </div>
      </div>

      <div className={styles.filters}>
        <select name="disciplinaId" value={filters.disciplinaId} onChange={(e) => setFilters(prev => ({...prev, disciplinaId: e.target.value}))}>
          <option value="">Todas as Disciplinas</option>
          {disciplinas.map(d => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        <input name="dataInicio" type="date" value={filters.dataInicio} onChange={(e) => setFilters(prev => ({...prev, dataInicio: e.target.value}))} />
        <input name="dataFim" type="date" value={filters.dataFim} onChange={(e) => setFilters(prev => ({...prev, dataFim: e.target.value}))} />
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