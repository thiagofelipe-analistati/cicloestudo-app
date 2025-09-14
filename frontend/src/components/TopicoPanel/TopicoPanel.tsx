// src/components/TopicoPanel/TopicoPanel.tsx
import { FormEvent, useState, useEffect } from 'react';
import type { Disciplina } from '../../services/disciplinaService';
import type { Topico } from '../../services/topicoService';
import styles from './TopicoPanel.module.css';

// 1. Atualizamos as propriedades para receber as funções de update e delete
interface TopicoPanelProps {
  disciplinaSelecionada: Disciplina | null;
  topicos: Topico[];
  onFetchTopicos: (disciplinaId: string) => Promise<void>;
  onCreate: (disciplinaId: string, nome: string) => Promise<void>;
  onUpdate: (topicoId: string, disciplinaId: string, nome: string) => Promise<void>;
  onDelete: (topicoId: string, disciplinaId: string) => Promise<void>;
}

export function TopicoPanel({ disciplinaSelecionada, topicos, onCreate, onUpdate, onDelete, onFetchTopicos }: TopicoPanelProps) {
  const [nomeNovoTopico, setNomeNovoTopico] = useState('');
  
  // 2. Adicionamos estados locais para controlar a edição
  const [editingTopicoId, setEditingTopicoId] = useState<string | null>(null);
  const [editingTopicoName, setEditingTopicoName] = useState('');

  useEffect(() => {
    setNomeNovoTopico('');
    setEditingTopicoId(null); // Reseta a edição ao mudar de disciplina
  }, [disciplinaSelecionada]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (disciplinaSelecionada && nomeNovoTopico.trim()) {
      await onCreate(disciplinaSelecionada.id, nomeNovoTopico);
      setNomeNovoTopico('');
      onFetchTopicos(disciplinaSelecionada.id); 
    }
  };

  // 3. Adicionamos as funções para entrar e salvar o modo de edição
  const handleEnterEditMode = (topico: Topico) => {
    setEditingTopicoId(topico.id);
    setEditingTopicoName(topico.nome);
  };
  
  const handleSaveEdit = async (topicoId: string) => {
    if (disciplinaSelecionada && editingTopicoName.trim()) {
      await onUpdate(topicoId, disciplinaSelecionada.id, editingTopicoName);
      setEditingTopicoId(null);
      onFetchTopicos(disciplinaSelecionada.id);
    }
  };

  const handleDelete = async (topicoId: string) => {
    if(disciplinaSelecionada && window.confirm('Tem certeza?')){
      await onDelete(topicoId, disciplinaSelecionada.id);
      onFetchTopicos(disciplinaSelecionada.id);
    }
  };


  if (!disciplinaSelecionada) {
    return <div className={styles.panel}><h2>Selecione uma disciplina para ver os tópicos</h2></div>;
  }
  
  return (
    <div className={styles.panel}>
      <h2>Tópicos de: {disciplinaSelecionada.nome}</h2>
      <form onSubmit={handleCreate} className={styles.form}>
        <input
          type="text"
          placeholder="Novo tópico"
          value={nomeNovoTopico}
          onChange={(e) => setNomeNovoTopico(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>
      <ul className={styles.list}>
        {topicos.map((topico) => (
          <li key={topico.id}>
            {/* 4. Lógica para exibir o modo de edição ou visualização */}
            {editingTopicoId === topico.id ? (
              <div className={styles.editMode}>
                <input type="text" value={editingTopicoName} onChange={(e) => setEditingTopicoName(e.target.value)} />
                <button onClick={() => handleSaveEdit(topico.id)}>Salvar</button>
                <button onClick={() => setEditingTopicoId(null)}>Cancelar</button>
              </div>
            ) : (
              <div className={styles.viewMode}>
                <span>{topico.nome}</span>
                <div>
                  <button onClick={() => handleEnterEditMode(topico)}>Editar</button>
                  <button onClick={() => handleDelete(topico.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}