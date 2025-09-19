// src/pages/PlanejamentoPage.tsx
import { useState, useEffect, FormEvent } from 'react';
import styles from './PlanejamentoPage.module.css';
import { useData } from '../contexts/DataContext';
import type { Ciclo } from '../services/cicloService';
import { getAllCiclos, createCiclo } from '../services/cicloService';

export function PlanejamentoPage() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nomeNovoCiclo, setNomeNovoCiclo] = useState('');

  // Usamos o refetchData do contexto para atualizar outras partes do app se necessário
  const { refetchData } = useData(); 

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
      fetchCiclos(); // Re-busca a lista de ciclos
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
        {/* Futuramente, um botão para criar um novo ciclo aqui */}
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
            {/* Futuramente, botões para editar e adicionar disciplinas ao ciclo */}
          </div>
        ))}
      </div>
    </div>
  );
}