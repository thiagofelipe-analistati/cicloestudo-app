// src/components/KpiCard/KpiCard.tsx
import styles from './KpiCard.module.css';

interface KpiCardProps {
  title: string;
  value: string;
  details?: React.ReactNode; // Permite passar HTML/componentes como detalhes
}

export function KpiCard({ title, value, details }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
      {details && <div className={styles.details}>{details}</div>}
    </div>
  );
}