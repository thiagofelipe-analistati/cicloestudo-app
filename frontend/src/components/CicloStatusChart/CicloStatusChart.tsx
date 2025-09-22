import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './CicloStatusChart.module.css';
import type { CicloComProgresso } from '../../services/cicloService';

interface CicloStatusChartProps {
  cicloAtivo: CicloComProgresso;
}

// Paleta de cores suaves e vivas (vermelho, laranja, amarelo, verde, azul claro, lilás)
const softColors = [
  "#ff0000", // vermelho suave
  "#70c927", // laranja suave
  "#FFD93D", // amarelo
  "#3d9448", // verde suave
  "#3f84e6", // azul claro
  "#a14fe0"  // lilás
];

// Função para pegar uma cor da paleta de forma previsível
const getColor = (index: number): string => {
  return softColors[index % softColors.length];
};

export function CicloStatusChart({ cicloAtivo }: CicloStatusChartProps) {
  const totalPlanejado = cicloAtivo.itens.reduce(
    (acc, item) => acc + item.tempoMinutos,
    0
  );

  const totalEstudado = cicloAtivo.itens.reduce(
    (acc, item) =>
      acc + Math.min(item.tempoEstudadoMinutos ?? 0, item.tempoMinutos),
    0
  );

  const progressoGeral =
    totalPlanejado > 0 ? (totalEstudado / totalPlanejado) * 100 : 0;

  const dadosParaGrafico = cicloAtivo.itens.map((item, index) => ({
    name: item.disciplina.nome,
    value: item.tempoMinutos,
    color: getColor(index),
  }));

  return (
    <div className={styles.chartContainer}>
      <h3>{cicloAtivo.nome}</h3>
        <div className={styles.conclusoes}>
          <span>Ciclos Finalizados:</span>
          <strong>{cicloAtivo.conclusoes}</strong>
        </div>
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
