import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './CicloStatusChart.module.css';
import type { CicloComProgresso } from '../../services/cicloService';

interface CicloStatusChartProps {
  cicloAtivo: CicloComProgresso;
}

const softColors = ["#ff6b6b", "#70c927", "#FFD93D", "#3d9448", "#3f84e6", "#a14fe0"];

export function CicloStatusChart({ cicloAtivo }: CicloStatusChartProps) {
  // Dados para cada disciplina: estudado e restante
  const dadosParaGrafico = cicloAtivo.itens.flatMap((item, index) => {
    const cor = softColors[index % softColors.length];
    const estudado = Math.min(item.tempoEstudadoMinutos || 0, item.tempoMinutos);
    const restante = item.tempoMinutos - estudado;
    return [
      { name: item.disciplina.nome, value: estudado, color: cor },
      { name: `${item.disciplina.nome}-restante`, value: restante, color: `${cor}55` }, // parte não concluída com opacidade
    ];
  });

  const totalPlanejado = cicloAtivo.itens.reduce((acc, i) => acc + i.tempoMinutos, 0);
  const totalEstudado = cicloAtivo.itens.reduce((acc, i) => acc + Math.min(i.tempoEstudadoMinutos || 0, i.tempoMinutos), 0);
  const progressoGeral = totalPlanejado > 0 ? (totalEstudado / totalPlanejado) * 100 : 0;

  return (
    <div className={styles.chartContainer}>
      <h3>{cicloAtivo.nome}</h3>
      <div className={styles.conclusoes}>
        <span>Ciclos Finalizados:</span>
        <strong>{cicloAtivo.conclusoes}</strong>
      </div>

      {/* Container principal do gráfico + legenda */}
      <div className={styles.chartWithLegend}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosParaGrafico}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                cornerRadius={4}
                isAnimationActive={false}
              >
                {dadosParaGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name.endsWith('-restante')) return [`${value} min restantes`, name.replace('-restante','')];
                  return [`${value} min`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerText}>
            <span>{progressoGeral.toFixed(0)}%</span>
            <small>Concluído</small>
          </div>
        </div>

        {/* Legenda */}
        <div className={styles.customLegend}>
          {cicloAtivo.itens.map((item, index) => {
            const cor = softColors[index % softColors.length];
            return (
              <div key={item.disciplina.id} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: cor }} />
                {item.disciplina.nome}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
