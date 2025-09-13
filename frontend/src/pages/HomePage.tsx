// src/pages/HomePage.tsx
import { useState, useEffect, FormEvent } from 'react';
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas, createDisciplina, updateDisciplina, deleteDisciplina } from '../services/disciplinaService';

export function HomePage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nomeNovaDisciplina, setNomeNovaDisciplina] = useState('');
  const [feedback, setFeedback] = useState('');

  // --- NOVOS ESTADOS PARA A EDIÇÃO ---
  // Guarda o ID da disciplina que está sendo editada
  const [editingId, setEditingId] = useState<string | null>(null); 
  // Guarda o novo nome da disciplina sendo editada
  const [editingName, setEditingName] = useState(''); 

  // Função para buscar os dados (reutilizada)
  const fetchDisciplinas = async () => {
    try {
      const data = await getAllDisciplinas();
      setDisciplinas(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
      setFeedback('Erro ao carregar disciplinas.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const handleCriarDisciplina = async (event: FormEvent) => {
    event.preventDefault();
    if (!nomeNovaDisciplina.trim()) return;

    try {
      await createDisciplina(nomeNovaDisciplina);
      setFeedback('Disciplina criada com sucesso!');
      setNomeNovaDisciplina('');
      fetchDisciplinas();
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
      setFeedback('Falha ao criar disciplina.');
    }
  };

  // --- NOVA FUNÇÃO PARA DELETAR UMA DISCIPLINA ---
  const handleDeletarDisciplina = async (id: string) => {
    // Confirmação para evitar exclusões acidentais
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await deleteDisciplina(id);
        setFeedback('Disciplina excluída com sucesso!');
        fetchDisciplinas(); // Atualiza a lista
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
        setFeedback('Falha ao excluir disciplina.');
      }
    }
  };
  
  // --- NOVA FUNÇÃO PARA SALVAR A EDIÇÃO ---
  const handleSalvarEdicao = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateDisciplina(id, editingName);
      setFeedback('Disciplina atualizada com sucesso!');
      setEditingId(null); // Sai do modo de edição
      setEditingName('');
      fetchDisciplinas(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
      setFeedback('Falha ao atualizar disciplina.');
    }
  };

  // --- NOVA FUNÇÃO PARA ENTRAR NO MODO DE EDIÇÃO ---
  const handleEntrarModoEdicao = (disciplina: Disciplina) => {
    setEditingId(disciplina.id);
    setEditingName(disciplina.nome);
  };


  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Disciplinas</h2>
      <form onSubmit={handleCriarDisciplina}>
        <h3>Adicionar Nova Disciplina</h3>
        <input
          type="text"
          placeholder="Nome da disciplina"
          value={nomeNovaDisciplina}
          onChange={(e) => setNomeNovaDisciplina(e.target.value)}
        />
        <button type="submit">Salvar</button>
      </form>
      {feedback && <p>{feedback}</p>}
      
      <hr />

      <h3>Disciplinas Cadastradas:</h3>
      <ul>
        {disciplinas.map((disciplina) => (
          <li key={disciplina.id} style={{ marginBottom: '10px' }}>
            {/* --- LÓGICA DE EXIBIÇÃO: MOSTRA O INPUT SE ESTIVER EDITANDO --- */}
            {editingId === disciplina.id ? (
              // Modo de Edição
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleSalvarEdicao(disciplina.id)}>Confirmar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              // Modo de Visualização
              <>
                <span style={{ marginRight: '10px' }}>{disciplina.nome}</span>
                <button onClick={() => handleEntrarModoEdicao(disciplina)}>Editar</button>
                <button onClick={() => handleDeletarDisciplina(disciplina.id)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}