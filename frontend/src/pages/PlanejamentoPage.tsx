// src/pages/PlanejamentoPage.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import styles from './PlanejamentoPage.module.css';
import type { Ciclo } from '../services/cicloService';
import { getAllCiclos, createCiclo, updateCiclo, deleteCiclo, removeItemDoCiclo, reorderCicloItens } from '../services/cicloService';
import { AddItemCicloModal } from '../components/AddItemCicloModal/AddItemCicloModal';
import { FaPen, FaTrash } from 'react-icons/fa';


// Função Helper para formatar o tempo
const formatarTempoTotal = (totalMinutos: number) => {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${String(horas).padStart(2, '0')}h${String(minutos).padStart(2, '0')}min`;
};

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
    if (!nomeNovoCiclo.trim()) return;
    await createCiclo(nomeNovoCiclo);
    setNomeNovoCiclo('');
    fetchCiclos();
  };

  const handleDeleteCiclo = async (cicloId: string) => {
    if (window.confirm('Tem certeza?')) {
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

  const handleOnDragEnd = async (result: DropResult, cicloId: string) => {
    if (!result.destination) return;
    
    const cicloAfetado = ciclos.find(c => c.id === cicloId);
    if (!cicloAfetado) return;

    const items = Array.from(cicloAfetado.itens);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const novosCiclos = ciclos.map(c => 
      c.id === cicloId ? { ...c, itens: items } : c
    );
    setCiclos(novosCiclos);

    const itensParaApi = items.map((item, index) => ({
      id: item.id,
      ordem: index + 1,
    }));

    try {
      await reorderCicloItens(cicloId, itensParaApi);
    } catch (error) {
      console.error("Falha ao reordenar", error);
      fetchCiclos(); // Reverte para o estado do servidor se a API falhar
    }
  };

  if (carregando) {
    return <div className={styles.container}>A carregar planeamento...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}><h1>Planeamento de Ciclos</h1></div>
        <div className={styles.newCicloForm}>
          <form onSubmit={handleCreateCiclo}>
            <input type="text" placeholder="Nome do novo ciclo" value={nomeNovoCiclo} onChange={(e) => setNomeNovoCiclo(e.target.value)} required />
            <button type="submit">Criar Ciclo</button>
          </form>
        </div>
        <div className={styles.ciclosList}>
          {ciclos.map(ciclo => {
            const totalMinutos = ciclo.itens.reduce((acc, item) => acc + item.tempoMinutos, 0);
            const tempoTotalFormatado = formatarTempoTotal(totalMinutos);

            return (
              <div key={ciclo.id} className={styles.cicloCard}>
                <div className={styles.cicloHeader}>
                  {editingCiclo?.id === ciclo.id ? (
                    <form onSubmit={handleUpdateCiclo} className={styles.editForm}>
                      <input type="text" value={editingCiclo.nome} onChange={(e) => setEditingCiclo({...editingCiclo, nome: e.target.value})} autoFocus/>
                      <button type="submit">Salvar</button>
                      <button type="button" onClick={() => setEditingCiclo(null)}>Cancelar</button>
                    </form>
                  ) : (
                    <h3>{ciclo.nome} - <span>({tempoTotalFormatado})</span></h3>
                  )}
                  <div className={styles.actions}>
                    <button onClick={() => setEditingCiclo({ id: ciclo.id, nome: ciclo.nome })} title="Editar Ciclo"><FaPen /></button>
                    <button onClick={() => handleDeleteCiclo(ciclo.id)} title="Excluir Ciclo"><FaTrash /></button>
                  </div>
                </div>
                
                <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, ciclo.id)}>
                  <Droppable droppableId={ciclo.id}>
                    {(provided) => (
                      <ul className={styles.itemList} {...provided.droppableProps} ref={provided.innerRef}>
                        {ciclo.itens.length > 0 ? ciclo.itens.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <li className={styles.item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <span>{item.disciplina.nome}</span>
                                <span>
                                  {item.tempoMinutos} min
                                  <button onClick={() => handleRemoveItem(item.id)} className={styles.deleteButton} title="Remover item">
                                    <FaTrash />
                                  </button>
                                </span>
                              </li>
                            )}
                          </Draggable>
                        )) : ( !provided.placeholder && <p>Nenhuma disciplina adicionada.</p> )}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
                
                <button className={styles.addButton} onClick={() => handleOpenModal(ciclo)}>Adicionar Matéria</button>
              </div>
            );
          })}
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