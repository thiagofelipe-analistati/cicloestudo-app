// src/components/DisciplinaPanel/DisciplinaPanel.tsx
import { useState} from 'react';
import type { FormEvent } from 'react';
import type { Disciplina } from '../../services/disciplinaService';
import styles from './DisciplinaPanel.module.css';

// Definimos as propriedades que este componente espera receber da HomePage
interface DisciplinaPanelProps {
  disciplinas: Disciplina[];
  onSelect: (disciplina: Disciplina) => void;
  onCreate: (nome: string) => Promise<void>;
  onUpdate: (id: string, nome: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DisciplinaPanel({ disciplinas, onSelect, onCreate, onUpdate, onDelete }: DisciplinaPanelProps) {
  // Estado local para os formulários deste componente
  const [nomeNovaDisciplina, setNomeNovaDisciplina] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    onCreate(nomeNovaDisciplina).then(() => setNomeNovaDisciplina(''));
  };

  const handleEnterEditMode = (disciplina: Disciplina) => {
    setEditingId(disciplina.id);
    setEditingName(disciplina.nome);
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, editingName).then(() => setEditingId(null));
  };

  return (
    <div className={styles.panel}>
      <h2>Disciplinas</h2>
      <form onSubmit={handleCreate} className={styles.form}>
        <input
          type="text"
          placeholder="Nova disciplina"
          value={nomeNovaDisciplina}
          onChange={(e) => setNomeNovaDisciplina(e.target.value)}
        />
        <button type="submit">Adicionarx</button>
      </form>
      <ul className={styles.list}>
        {disciplinas.map((disciplina) => (
          <li key={disciplina.id}>
            {editingId === disciplina.id ? (
              <div className={styles.editMode}>
                <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <button onClick={() => handleSaveEdit(disciplina.id)}>Salvar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </div>
            ) : (
              <div className={styles.viewMode}>
                <span onClick={() => onSelect(disciplina)}>{disciplina.nome}</span>
                <div>
                  <button onClick={() => handleEnterEditMode(disciplina)}>Editar</button>
                  <button onClick={() => onDelete(disciplina.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}