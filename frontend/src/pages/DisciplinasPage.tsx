// src/pages/DisciplinasPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from './HomePage.module.css';
import { FaPen, FaTrash } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { createDisciplina, updateDisciplina, deleteDisciplina } from '../services/disciplinaService';
import type { Topico } from '../services/topicoService';
import { getTopicosByDisciplina, createTopico, updateTopico, deleteTopico } from '../services/topicoService';

export function DisciplinasPage() {
  const { disciplinas, refetchData } = useData();

  const [topicos, setTopicos] = useState<Record<string, Topico[]>>({});
  const [expandedDisciplinaId, setExpandedDisciplinaId] = useState<string | null>(null);
  const [isAddingDisciplina, setIsAddingDisciplina] = useState(false);
  const [nomeNovaDisciplina, setNomeNovaDisciplina] = useState('');
  const [novoTopicosTexto, setNovoTopicosTexto] = useState(''); // <--- AGORA É TEXTAREA
  const [editingDisciplina, setEditingDisciplina] = useState<{ id: string; nome: string } | null>(null);
  const [editingTopico, setEditingTopico] = useState<{ id: string; nome: string } | null>(null);

  const fetchTopicos = async (disciplinaId: string) => {
    try {
      const topicosData = await getTopicosByDisciplina(disciplinaId);
      setTopicos(prev => ({ ...prev, [disciplinaId]: topicosData }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDisciplina = (disciplinaId: string) => {
    const newExpandedId = expandedDisciplinaId === disciplinaId ? null : disciplinaId;
    setExpandedDisciplinaId(newExpandedId);
    if (newExpandedId && !topicos[newExpandedId]) {
      fetchTopicos(newExpandedId);
    }
  };

  const handleCriarDisciplina = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeNovaDisciplina.trim()) return;
    await createDisciplina(nomeNovaDisciplina);
    setNomeNovaDisciplina('');
    setIsAddingDisciplina(false);
    refetchData();
  };

  const handleUpdateDisciplina = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingDisciplina || !editingDisciplina.nome.trim()) return;
    await updateDisciplina(editingDisciplina.id, editingDisciplina.nome);
    setEditingDisciplina(null);
    refetchData();
  };

  const handleDeleteDisciplina = async (disciplinaId: string) => {
    if (window.confirm('Tem certeza? Isso excluirá todos os tópicos e sessões associados.')) {
      await deleteDisciplina(disciplinaId);
      if (expandedDisciplinaId === disciplinaId) {
        setExpandedDisciplinaId(null);
      }
      refetchData();
    }
  };

  const handleCriarTopicos = async (e: FormEvent, disciplinaId: string) => {
    e.preventDefault();
    const linhas = novoTopicosTexto
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (linhas.length === 0) return;

    for (const linha of linhas) {
      await createTopico(disciplinaId, linha);
    }

    setNovoTopicosTexto('');
    fetchTopicos(disciplinaId);
  };

  const handleUpdateTopico = async (e: FormEvent, disciplinaId: string) => {
    e.preventDefault();
    if (!editingTopico || !editingTopico.nome.trim()) return;
    await updateTopico(editingTopico.id, disciplinaId, editingTopico.nome);
    setEditingTopico(null);
    fetchTopicos(disciplinaId);
  };

  const handleDeleteTopico = async (topicoId: string, disciplinaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tópico?')) {
      await deleteTopico(topicoId, disciplinaId);
      fetchTopicos(disciplinaId);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Disciplinas</h1>
        {!isAddingDisciplina && (
          <button className={styles.addButton} onClick={() => setIsAddingDisciplina(true)}>
            Adicionar Nova Disciplina
          </button>
        )}
      </div>

      {isAddingDisciplina && (
        <form onSubmit={handleCriarDisciplina} className={styles.addForm}>
          <input
            type="text"
            placeholder="Nome da nova disciplina"
            value={nomeNovaDisciplina}
            onChange={(e) => setNomeNovaDisciplina(e.target.value)}
            autoFocus
          />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setIsAddingDisciplina(false)}>Cancelar</button>
        </form>
      )}

      <ul className={styles.disciplinaList}>
        {disciplinas.map(disciplina => (
          <li key={disciplina.id} className={styles.disciplinaItem}>
            <div className={styles.disciplinaHeader} onClick={() => handleToggleDisciplina(disciplina.id)}>
              {editingDisciplina?.id === disciplina.id ? (
                <form onSubmit={handleUpdateDisciplina} className={styles.editForm} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingDisciplina.nome}
                    onChange={(e) => setEditingDisciplina({ ...editingDisciplina, nome: e.target.value })}
                    autoFocus
                  />
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={() => setEditingDisciplina(null)}>Cancelar</button>
                </form>
              ) : (
                <h3>{disciplina.nome}</h3>
              )}
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditingDisciplina({ id: disciplina.id, nome: disciplina.nome })} title="Editar Disciplina"><FaPen /></button>
                <button onClick={() => handleDeleteDisciplina(disciplina.id)} title="Excluir Disciplina"><FaTrash /></button>
              </div>
            </div>

            {expandedDisciplinaId === disciplina.id && (
              <div className={styles.topicosContainer}>
                <ul>
                  {(topicos[disciplina.id] || []).map(topico => (
                    <li key={topico.id} className={styles.topicoItem}>
                      {editingTopico?.id === topico.id ? (
                        <form onSubmit={(e) => handleUpdateTopico(e, disciplina.id)} className={styles.editForm}>
                          <input
                            type="text"
                            value={editingTopico.nome}
                            onChange={(e) => setEditingTopico({ ...editingTopico, nome: e.target.value })}
                            autoFocus
                          />
                          <button type="submit">Salvar</button>
                          <button type="button" onClick={() => setEditingTopico(null)}>Cancelar</button>
                        </form>
                      ) : (
                        <span>{topico.nome}</span>
                      )}
                      <div className={styles.actions}>
                        <button onClick={() => setEditingTopico({ id: topico.id, nome: topico.nome })} title="Editar Tópico"><FaPen /></button>
                        <button onClick={() => handleDeleteTopico(topico.id, disciplina.id)} title="Excluir Tópico"><FaTrash /></button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Textarea para múltiplos tópicos */}
                <form onSubmit={(e) => handleCriarTopicos(e, disciplina.id)} className={styles.addTopicosForm}>
                  <textarea
                    placeholder="Adicionar tópicos (um por linha)"
                    value={novoTopicosTexto}
                    onChange={(e) => setNovoTopicosTexto(e.target.value)}
                    rows={4}
                    className={styles.topicosTextarea} // <-- MUDANÇA IMPORTANTE AQUI
                  />
                  <button type="submit" className={styles.addButton}> {/* <-- E AQUI */}
                    Salvar Tópicos
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
