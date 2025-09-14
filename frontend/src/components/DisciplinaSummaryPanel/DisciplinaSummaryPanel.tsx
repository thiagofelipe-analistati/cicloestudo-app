// src/components/DisciplinaSummaryPanel/DisciplinaSummaryPanel.tsx
import styles from './DisciplinaSummaryPanel.module.css';
import type { DisciplinaSummary } from '../../services/disciplinaService';

interface DisciplinaSummaryPanelProps {
  summaryData: DisciplinaSummary[];
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h${String(m).padStart(2, '0')}min`;
};

const calculatePerformance = (acertos: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((acertos / total) * 100);
};

export function DisciplinaSummaryPanel({ summaryData }: DisciplinaSummaryPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.disciplina}>Disciplinas</span>
        <span className={styles.tempo}>Tempo</span>
        <span className={styles.questoes}>Questões</span>
        <span className={styles.percentual}>%</span>
      </div>
      <ul className={styles.list}>
        {summaryData.map(item => (
          <li key={item.id} className={styles.listItem}>
            <span className={styles.disciplina}>{item.nome}</span>
            <span className={styles.tempo}>{formatTime(item.tempoTotal)}</span>
            <span className={styles.questoes}>{item.acertosTotal} / {item.questoesTotal}</span>
            <span className={styles.percentual}>{calculatePerformance(item.acertosTotal, item.questoesTotal)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}