import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import styles from './PlanejamentoPage.module.css';
import type { Ciclo } from '../services/cicloService';
import { getAllCiclos, createCiclo, removeItemDoCiclo } from '../services/cicloService';
import { AddItemCicloModal } from '../components/AddItemCicloModal/AddItemCicloModal';
import { FaTrash } from 'react-icons/fa';

export function PlanejamentoPage() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nomeNovoCiclo, setNomeNovoCiclo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cicloSelecionado, setCicloSelecionado] = useState<Ciclo | null>(null);

  const fetchCiclos = async () => {
    setCarregando(true);
    try {
      const data = await getAllCiclos();
      setCiclos(data);
    } catch (error) {
      console.error("Erro ao buscar ciclos na página:", error);
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
    } catch (error) { console.error("Erro ao criar ciclo:", error); }
  };

  const handleOpenModal = (ciclo: Ciclo) => {
    setCicloSelecionado(ciclo);
    setIsModalOpen(true);
  };
  
  const handleItemAdded = () => {
    fetchCiclos();
  };
  
  const handleRemoveItem = async (itemId: string) => {
    if (window.confirm('Tem certeza?')) {
      await removeItemDoCiclo(itemId);
      fetchCiclos();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Planeamento de Ciclos</h1>
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
          {carregando ? (
            <p>A carregar ciclos...</p>
          ) : ciclos.length === 0 ? (
            <p>Nenhum ciclo cadastrado. Crie um acima para começar.</p>
          ) : (
            ciclos.map(ciclo => (
              <div key={ciclo.id} className={styles.cicloCard}>
                <h3>{ciclo.nome}</h3>
                {ciclo.itens.length > 0 ? (
                  <ul className={styles.itemList}>
                    {ciclo.itens.map(item => (
                      <li key={item.id}>
                        <span>{item.disciplina.nome}</span>
                        <span>
                          {item.tempoMinutos} min
                          <button onClick={() => handleRemoveItem(item.id)} className={styles.deleteButton} title="Remover item">
                            <FaTrash />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma disciplina adicionada a este ciclo.</p>
                )}
                <button className={styles.addButton} onClick={() => handleOpenModal(ciclo)}>Adicionar Matéria</button>
              </div>
            ))
          )}
        </div>
      </div>

      {cicloSelecionado && (
        <AddItemCicloModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          ciclo={cicloSelecionado}
          onItemAdded={handleItemAdded}
        />
      )}
    </>
  );
}