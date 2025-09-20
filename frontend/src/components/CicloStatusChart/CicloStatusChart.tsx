// src/components/CicloStatusChart/CicloStatusChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './CicloStatusChart.module.css';
import type { Ciclo } from '../../services/cicloService';

// A interface de props foi corrigida para esperar a propriedade 'cicloAtivo'.
interface CicloStatusChartProps {
  cicloAtivo: Ciclo & { itens: ({ tempoEstudadoMinutos: number } & Ciclo['itens'][0])[] };
}

// Função para gerar cores aleatórias com base no nome da disciplina
const generateColor = (name: string): string => {
  let hash = 0;
  if (name.length === 0) return '#000000';
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
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
            <Pie data={dadosParaGrafico} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
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