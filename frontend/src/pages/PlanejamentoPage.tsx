// src/pages/PlanejamentoPage.tsx
import { useState, useEffect, FormEvent } from 'react';
import styles from './PlanejamentoPage.module.css'; // <-- A LINHA QUE FALTAVA
import type { Ciclo } from '../services/cicloService';
import { getAllCiclos, createCiclo } from '../services/cicloService';
// Importe outros componentes/hooks se necessário, como o useData

export function PlanejamentoPage() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nomeNovoCiclo, setNomeNovoCiclo] = useState('');

  const fetchCiclos = async () => {
    setCarregando(true);
    try {
      const data = await getAllCiclos();
      setCiclos(data);
    } catch (error) {
      console.error("Erro ao buscar ciclos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchCiclos();
  }, []);

  const handleCreateCiclo = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeNovoCiclo.trim()) return;

    try {
      await createCiclo(nomeNovoCiclo);
      setNomeNovoCiclo('');
      fetchCiclos();
    } catch (error) {
      console.error("Erro ao criar ciclo:", error);
    }
  };

  if (carregando) {
    return <div className={styles.container}>Carregando planejamento...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Planejamento de Ciclos</h1>
      </div>

      <div className={styles.newCicloForm}>
        <form onSubmit={handleCreateCiclo}>
          <input 
            type="text" 
            placeholder="Nome do novo ciclo"
            value={nomeNovoCiclo}
            onChange={(e) => setNomeNovoCiclo(e.target.value)}
          />
          <button type="submit">Criar Ciclo</button>
        </form>
      </div>

      <div className={styles.ciclosList}>
        {ciclos.map(ciclo => (
          <div key={ciclo.id} className={styles.cicloCard}>
            <h3>{ciclo.nome}</h3>
            {ciclo.itens.length > 0 ? (
              <ul>
                {ciclo.itens.map(item => (
                  <li key={item.id}>
                    {item.disciplina.nome} - {item.tempoMinutos} min
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma disciplina adicionada a este ciclo ainda.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}