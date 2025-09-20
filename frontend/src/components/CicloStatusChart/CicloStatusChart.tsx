import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './CicloStatusChart.module.css';
import type { CicloComProgresso } from '../../services/cicloService';

interface CicloStatusChartProps {
  cicloAtivo: CicloComProgresso;
}

// Gera cores suaves (pastel) baseadas no nome da disciplina
const generateColor = (name: string): string => {
  if (!name) return '#cccccc';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360; // Hue 0-359
  const s = 60; // Saturação menor
  const l = 85; // Luminosidade alta para cores claras
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export function CicloStatusChart({ cicloAtivo }: CicloStatusChartProps) {
  const totalPlanejado = cicloAtivo.itens.reduce((acc, item) => acc + item.tempoMinutos, 0);
  const totalEstudado = cicloAtivo.itens.reduce(
    (acc, item) => acc + Math.min(item.tempoEstudadoMinutos ?? 0, item.tempoMinutos),
    0
  );

  const progressoGeral = totalPlanejado > 0 ? (totalEstudado / totalPlanejado) * 100 : 0;

  const dadosParaGrafico = cicloAtivo.itens.map(item => ({
    name: item.disciplina.nome,
    value: item.tempoMinutos,
    color: generateColor(item.disciplina.nome),
  }));

  return (
    <div className={styles.chartContainer}>
      <h3>{cicloAtivo.nome}</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dadosParaGrafico}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {dadosParaGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} min`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerText}>
          <span>{progressoGeral.toFixed(0)}%</span>
          <small>Concluído</small>
        </div>
      </div>
    </div>
  );
}
