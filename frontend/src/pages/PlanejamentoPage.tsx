import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import styles from './PlanejamentoPage.module.css';
import type { Ciclo } from '../services/cicloService';
import { getAllCiclos, createCiclo, updateCiclo, deleteCiclo, removeItemDoCiclo } from '../services/cicloService';
import { AddItemCicloModal } from '../components/AddItemCicloModal/AddItemCicloModal';
import { FaPen, FaTrash } from 'react-icons/fa';

export function PlanejamentoPage() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nomeNovoCiclo, setNomeNovoCiclo] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cicloSelecionado, setCicloSelecionado] = useState<Ciclo | null>(null);

  const [editingCiclo, setEditingCiclo] = useState<{ id: string; nome: string } | null>(null);

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
    if (!nomeNovoCiclo.trim()) {
      alert('Por favor, preencha o nome do ciclo.');
      return;
    }
    await createCiclo(nomeNovoCiclo);
    setNomeNovoCiclo('');
    fetchCiclos();
  };

  const handleDeleteCiclo = async (cicloId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ciclo e todos os seus itens?')) {
      await deleteCiclo(cicloId);
      fetchCiclos();
    }
  };

  const handleUpdateCiclo = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCiclo || !editingCiclo.nome.trim()) return;
    await updateCiclo(editingCiclo.id, editingCiclo.nome);
    setEditingCiclo(null);
    fetchCiclos();
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

  if (carregando) {
    return <div className={styles.container}>A carregar planeamento...</div>;
  }

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
              required
            />
            <button type="submit">Criar Ciclo</button>
          </form>
        </div>

        <div className={styles.ciclosList}>
          {ciclos.map(ciclo => (
            <div key={ciclo.id} className={styles.cicloCard}>
              <div className={styles.cicloHeader}>
                {editingCiclo?.id === ciclo.id ? (
                  <form onSubmit={handleUpdateCiclo} className={styles.editForm}>
                    <input
                      type="text"
                      value={editingCiclo.nome}
                      onChange={(e) => setEditingCiclo({...editingCiclo, nome: e.target.value})}
                      autoFocus
                    />
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => setEditingCiclo(null)}>Cancelar</button>
                  </form>
                ) : (
                  <h3>{ciclo.nome}</h3>
                )}
                <div className={styles.actions}>
                  <button onClick={() => setEditingCiclo({ id: ciclo.id, nome: ciclo.nome })} title="Editar Ciclo"><FaPen /></button>
                  <button onClick={() => handleDeleteCiclo(ciclo.id)} title="Excluir Ciclo"><FaTrash /></button>
                </div>
              </div>
              
              <ul className={styles.itemList}>
                {ciclo.itens.length > 0 ? (
                  ciclo.itens.map(item => (
                    <li key={item.id} className={styles.item}>
                      <span>{item.disciplina.nome}</span>
                      <span>
                        {item.tempoMinutos} min
                        <button onClick={() => handleRemoveItem(item.id)} className={styles.deleteButton} title="Remover item">
                          <FaTrash />
                        </button>
                      </span>
                    </li>
                  ))
                ) : (
                  <p style={{padding: '1rem', textAlign: 'center', color: '#777'}}>Nenhuma disciplina adicionada.</p>
                )}
              </ul>
              
              <button className={styles.addButton} onClick={() => handleOpenModal(ciclo)}>Adicionar Matéria</button>
            </div>
          ))}
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