// ARQUIVO: src/pages/RevisoesPage.tsx

import { useState, useEffect } from 'react';
import styles from './RevisoesPage.module.css';
// A LINHA ABAIXO FOI CORRIGIDA (apenas um '../')
import { getRevisoesPendentes, marcarRevisaoComoConcluida } from '../services/revisaoService';
import type { Revisao } from '../services/revisaoService';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatarDataRevisao = (data: string) => {
  const dataObj = parseISO(data);
  if (isToday(dataObj)) return 'Hoje';
  if (isTomorrow(dataObj)) return 'Amanhã';
  return format(dataObj, "dd 'de' MMMM", { locale: ptBR });
};

export function RevisoesPage() {
  const [revisoes, setRevisoes] = useState<Revisao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const fetchRevisoes = async () => {
    try {
      setCarregando(true);
      const data = await getRevisoesPendentes();
      setRevisoes(data);
    } catch (error) {
      console.error("Falha ao buscar revisões", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchRevisoes();
  }, []);

  const handleConcluir = async (revisaoId: string) => {
    try {
      await marcarRevisaoComoConcluida(revisaoId);
      // Remove a revisão da lista na UI para uma resposta instantânea
      setRevisoes(prev => prev.filter(r => r.id !== revisaoId));
    } catch (error) {
      console.error("Falha ao concluir revisão", error);
      alert("Não foi possível concluir a revisão. Tente novamente.");
    }
  };

  if (carregando) {
    return <div className={styles.container}>Carregando revisões...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Revisões Agendadas</h1>
        <p>Aqui estão seus tópicos para revisar, ordenados por data.</p>
      </header>
      
      {revisoes.length === 0 ? (
        <div className={styles.semRevisoes}>
          <h2>Nenhuma revisão pendente!</h2>
          <p>Quando você concluir o estudo de um tópico e optar por agendar, suas revisões aparecerão aqui.</p>
        </div>
      ) : (
        <ul className={styles.revisoesList}>
          {revisoes.map((revisao) => (
            <li key={revisao.id} className={styles.revisaoItem}>
              <div className={styles.info}>
                <span className={styles.data}>{formatarDataRevisao(revisao.dataAgendada)}</span>
                <h3 className={styles.topicoNome}>{revisao.topico.nome}</h3>
                <p className={styles.disciplinaNome}>{revisao.topico.disciplina.nome}</p>
              </div>
              <button 
                className={styles.botaoConcluir} 
                onClick={() => handleConcluir(revisao.id)}
              >
                Concluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}