// src/components/AddItemCicloModal/AddItemCicloModal.tsx
import { useState} from 'react';
import type { FormEvent } from 'react';
import Modal from 'react-modal';
import styles from './AddItemCicloModal.module.css';
import { useData } from '../../contexts/DataContext';
import { addItemAoCiclo } from '../../services/cicloService';
import type { Ciclo } from '../../services/cicloService';

interface AddItemCicloModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  ciclo: Ciclo | null;
  onItemAdded: () => void; // Para avisar a página que um item foi adicionado
}

export function AddItemCicloModal({ isOpen, onRequestClose, ciclo, onItemAdded }: AddItemCicloModalProps) {
  const { disciplinas } = useData();
  const [disciplinaId, setDisciplinaId] = useState('');
  const [tempoMinutos, setTempoMinutos] = useState(60);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ciclo || !disciplinaId || !tempoMinutos) return;

    try {
      await addItemAoCiclo(ciclo.id, disciplinaId, tempoMinutos);
      onItemAdded();
      onRequestClose();
    } catch (error) {
      console.error("Erro ao adicionar item", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} /* ...outras props de estilo */>
      <h2>Adicionar Matéria ao Ciclo "{ciclo?.nome}"</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Disciplina</label>
          <select value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)} required>
            <option value="">Selecione...</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tempo (minutos)</label>
          <input 
            type="number" 
            value={tempoMinutos}
            onChange={e => setTempoMinutos(Number(e.target.value))}
            min="30"
            step="15"
            required
          />
        </div>
          <div className={styles.buttons}>
            <button type="button" onClick={onRequestClose} className={styles.cancelButton}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Adicionar</button>
          </div>
      </form>
    </Modal>
  );
}