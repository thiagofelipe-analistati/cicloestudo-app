// src/components/SessaoEstudoModal/SessaoEstudoModal.tsx

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Modal from 'react-modal';
import styles from './SessaoEstudoModal.module.css';
import type { Disciplina } from '../../services/disciplinaService';
import type { Topico } from '../../services/topicoService';
import { getTopicosByDisciplina } from '../../services/topicoService';
import { createSessaoEstudo } from '../../services/sessaoService';

interface SessaoEstudoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  disciplinas: Disciplina[];
  initialTimeInSeconds: number;
  onSessionSaved: () => void;
}

const timeToSeconds = (timeString: string): number => {
  if (!timeString) return 0;
  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;
  return (hours * 3600) + (minutes * 60) + seconds;
};

const secondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
  return todayWithOffset.toISOString().split('T')[0];
}

export function SessaoEstudoModal({ isOpen, onRequestClose, disciplinas, initialTimeInSeconds, onSessionSaved }: SessaoEstudoModalProps) {
  const [formData, setFormData] = useState({
    data: getTodayString(),
    disciplinaId: '',
    topicoId: '',
    categoria: 'Estudo',
    tempoEstudado: '00:00:00',
    acertosQuestoes: 0,
    errosQuestoes: 0,
  });

  // NOVO: Estados para controlar as opções de revisão
  const [concluiuTopico, setConcluiuTopico] = useState(false);
  const [agendarRevisao, setAgendarRevisao] = useState(false);
  const [topicos, setTopicos] = useState<Topico[]>([]);

  useEffect(() => {
    if (isOpen) {
      const tempoInicial = initialTimeInSeconds > 0 ? secondsToTime(initialTimeInSeconds) : '01:00:00';
      setFormData(prev => ({
        ...prev,
        data: getTodayString(),
        tempoEstudado: tempoInicial,
        disciplinaId: '',
        topicoId: '',
        categoria: 'Estudo',
        acertosQuestoes: 0,
        errosQuestoes: 0,
      }));
      // NOVO: Resetar os estados de revisão ao abrir o modal
      setConcluiuTopico(false);
      setAgendarRevisao(false);
    }
  }, [isOpen, initialTimeInSeconds]);

  useEffect(() => {
    if (formData.disciplinaId) {
      getTopicosByDisciplina(formData.disciplinaId).then(setTopicos);
    } else {
      setTopicos([]);
    }
    // Reseta a seleção de tópico e as opções de revisão se a disciplina mudar
    setFormData(prev => ({ ...prev, topicoId: '' }));
    setConcluiuTopico(false);
    setAgendarRevisao(false);
  }, [formData.disciplinaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const totalQuestoes = Number(formData.acertosQuestoes) + Number(formData.errosQuestoes);
    
    // NOVO: Adiciona os dados de revisão ao payload
    const dadosParaApi = {
      ...formData,
      tempoEstudado: timeToSeconds(formData.tempoEstudado),
      totalQuestoes: totalQuestoes,
      concluiuTopico: concluiuTopico,
      agendarRevisao: agendarRevisao,
    };

    try {
      await createSessaoEstudo(dadosParaApi);
      onSessionSaved(); // Isso vai disparar a atualização do dashboard
      onRequestClose();
    } catch (error) {
      console.error("Falha ao salvar a sessão:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.modal} overlayClassName={styles.overlay}>
      <h2>Registro de Estudo</h2>
      <form onSubmit={handleSubmit}>
        {/* ... campos de data, tempo, disciplina ... */}
        <div className={styles.formGroup}>
           <label htmlFor="data">Data do Estudo</label>
           <input type="date" name="data" id="data" value={formData.data} onChange={handleChange} required />
        </div>
        <div className={styles.formRow}>
           <div className={styles.formGroup}>
             <label htmlFor="tempoEstudado">Tempo (HH:MM:SS)</label>
             <input type="time" step="1" name="tempoEstudado" id="tempoEstudado" value={formData.tempoEstudado} onChange={handleChange} required />
           </div>
        </div>
        <div className={styles.formGroup}>
           <label htmlFor="disciplinaId">Disciplina</label>
           <select name="disciplinaId" id="disciplinaId" value={formData.disciplinaId} onChange={handleChange} required>
             <option value="">Selecione uma disciplina</option>
             {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
           </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="topicoId">Tópico</label>
          <select name="topicoId" id="topicoId" value={formData.topicoId} onChange={handleChange} disabled={topicos.length === 0} required>
            <option value="">Selecione um tópico</option>
            {topicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        
        {/* --- NOVOS CAMPOS DE REVISÃO --- */}
        {formData.topicoId && (
            <div className={styles.revisaoOptions}>
                <div className={styles.checkboxGroup}>
                    <input 
                        type="checkbox" 
                        id="concluiuTopico" 
                        checked={concluiuTopico} 
                        onChange={(e) => {
                            setConcluiuTopico(e.target.checked);
                            // Se desmarcar, desmarca também o agendamento
                            if (!e.target.checked) setAgendarRevisao(false);
                        }}
                    />
                    <label htmlFor="concluiuTopico">Concluí o estudo deste tópico</label>
                </div>

                {concluiuTopico && (
                    <div className={`${styles.checkboxGroup} ${styles.subOption}`}>
                        <input 
                            type="checkbox" 
                            id="agendarRevisao"
                            checked={agendarRevisao}
                            onChange={(e) => setAgendarRevisao(e.target.checked)}
                        />
                        <label htmlFor="agendarRevisao">Agendar revisão espaçada (1, 7 e 30 dias)</label>
                    </div>
                )}
            </div>
        )}
        
        {/* ... resto do formulário ... */}
        <div className={styles.formGroup}>
           <label htmlFor="categoria">Categoria</label>
           <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange}>
             <option value="Estudo">Estudo</option>
             <option value="Revisão">Revisão</option>
             <option value="Exercícios">Exercícios</option>
           </select>
        </div>
        <div className={styles.formRow}>
           <div className={styles.formGroup}>
             <label htmlFor="acertosQuestoes">Acertos</label>
             <input type="number" name="acertosQuestoes" id="acertosQuestoes" value={formData.acertosQuestoes} onChange={handleChange} />
           </div>
           <div className={styles.formGroup}>
             <label htmlFor="errosQuestoes">Erros</label>
             <input type="number" name="errosQuestoes" id="errosQuestoes" value={formData.errosQuestoes} onChange={handleChange} />
           </div>
        </div>
        <div className={styles.buttons}>
          <button type="button" className={styles.cancelButton} onClick={onRequestClose}>Cancelar</button>
          <button type="submit" className={styles.saveButton}>Salvar</button>
        </div>
      </form>
    </Modal>
  );
}