// src/pages/HomePage.tsx
import { useState, useEffect, FormEvent } from 'react';
// Imports de Disciplina
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas, createDisciplina, updateDisciplina, deleteDisciplina } from '../services/disciplinaService';
// Imports de Tópico
import type { Topico } from '../services/topicoService';
import { getTopicosByDisciplina, createTopico, updateTopico, deleteTopico } from '../services/topicoService';


export function HomePage() {
  // --- Estados para Disciplinas ---
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nomeNovaDisciplina, setNomeNovaDisciplina] = useState('');
  // --- NOVOS ESTADOS PARA EDIÇÃO DE DISCIPLINA ---
  const [editingDisciplinaId, setEditingDisciplinaId] = useState<string | null>(null);
  const [editingDisciplinaName, setEditingDisciplinaName] = useState('');

  // --- Estados para Tópicos ---
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [nomeNovoTopico, setNomeNovoTopico] = useState('');
  // --- NOVOS ESTADOS PARA EDIÇÃO DE TÓPICO ---
  const [editingTopicoId, setEditingTopicoId] = useState<string | null>(null);
  const [editingTopicoName, setEditingTopicoName] = useState('');
  
  // --- Estados Gerais ---
  const [carregando, setCarregando] = useState(true);
  
  // --- Funções de Disciplina ---
  const fetchDisciplinas = async () => {
    try {
      const data = await getAllDisciplinas();
      setDisciplinas(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    setCarregando(true);
    fetchDisciplinas().finally(() => setCarregando(false));
  }, []);

  const handleCriarDisciplina = async (event: FormEvent) => {
    event.preventDefault();
    if (!nomeNovaDisciplina.trim()) return;
    try {
      await createDisciplina(nomeNovaDisciplina);
      setNomeNovaDisciplina('');
      fetchDisciplinas();
    } catch (error) { console.error(error); }
  };

  const handleDeletarDisciplina = async (id: string) => {
    if (window.confirm('Tem certeza? Isso excluirá todos os tópicos e sessões associados.')) {
      try {
        await deleteDisciplina(id);
        fetchDisciplinas();
        if (selectedDisciplina?.id === id) {
          setSelectedDisciplina(null);
          setTopicos([]);
        }
      } catch (error) { console.error(error); }
    }
  };

  // --- NOVAS FUNÇÕES PARA EDIÇÃO DE DISCIPLINA ---
  const handleEntrarModoEdicaoDisciplina = (disciplina: Disciplina) => {
    setEditingDisciplinaId(disciplina.id);
    setEditingDisciplinaName(disciplina.nome);
  };

  const handleSalvarEdicaoDisciplina = async (id: string) => {
    if (!editingDisciplinaName.trim()) return;
    try {
      await updateDisciplina(id, editingDisciplinaName);
      setEditingDisciplinaId(null);
      setEditingDisciplinaName('');
      fetchDisciplinas();
    } catch (error) { console.error(error); }
  };

  // --- Funções de Tópico ---
  const handleSelectDisciplina = async (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    try {
      const data = await getTopicosByDisciplina(disciplina.id);
      setTopicos(data);
    } catch (error) {
      console.error(error);
      setTopicos([]);
    }
  };
  
  const handleCriarTopico = async (event: FormEvent) => {
    event.preventDefault();
    if (!nomeNovoTopico.trim() || !selectedDisciplina) return;
    try {
      await createTopico(selectedDisciplina.id, nomeNovoTopico);
      setNomeNovoTopico('');
      handleSelectDisciplina(selectedDisciplina); // Re-busca os tópicos
    } catch (error) { console.error(error); }
  };
  
  const handleDeletarTopico = async (topicoId: string) => {
    if (!selectedDisciplina) return;
    if(window.confirm('Tem certeza que deseja excluir este tópico?')) {
      try {
        await deleteTopico(topicoId, selectedDisciplina.id);
        handleSelectDisciplina(selectedDisciplina); // Re-busca os tópicos
      } catch (error) { console.error(error); }
    }
  };

  // --- NOVAS FUNÇÕES PARA EDIÇÃO DE TÓPICO ---
  const handleEntrarModoEdicaoTopico = (topico: Topico) => {
    setEditingTopicoId(topico.id);
    setEditingTopicoName(topico.nome);
  };

  const handleSalvarEdicaoTopico = async (topicoId: string) => {
    if (!editingTopicoName.trim() || !selectedDisciplina) return;
    try {
      await updateTopico(topicoId, selectedDisciplina.id, editingTopicoName);
      setEditingTopicoId(null);
      setEditingTopicoName('');
      handleSelectDisciplina(selectedDisciplina); // Re-busca os tópicos
    } catch (error) { console.error(error); }
  };
  
  if (carregando) return <div>Carregando...</div>;

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* Coluna da Esquerda: Disciplinas */}
      <div style={{ width: '50%' }}>
        <h2>Disciplinas</h2>
        <form onSubmit={handleCriarDisciplina}>
          <input
            type="text"
            placeholder="Nova disciplina"
            value={nomeNovaDisciplina}
            onChange={(e) => setNomeNovaDisciplina(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
        <ul>
          {disciplinas.map((disciplina) => (
            <li key={disciplina.id} style={{ marginBottom: '10px' }}>
              {editingDisciplinaId === disciplina.id ? (
                <>
                  <input type="text" value={editingDisciplinaName} onChange={(e) => setEditingDisciplinaName(e.target.value)} />
                  <button onClick={() => handleSalvarEdicaoDisciplina(disciplina.id)}>Salvar</button>
                  <button onClick={() => setEditingDisciplinaId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <span onClick={() => handleSelectDisciplina(disciplina)} style={{ cursor: 'pointer' }}>
                    {disciplina.nome}
                  </span>
                  <button onClick={() => handleEntrarModoEdicaoDisciplina(disciplina)} style={{ marginLeft: '10px' }}>Editar</button>
                  <button onClick={() => handleDeletarDisciplina(disciplina.id)}>Excluir</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Coluna da Direita: Tópicos */}
      <div style={{ width: '50%' }}>
        {selectedDisciplina ? (
          <>
            <h2>Tópicos de: {selectedDisciplina.nome}</h2>
            <form onSubmit={handleCriarTopico}>
              <input type="text" placeholder="Novo tópico" value={nomeNovoTopico} onChange={(e) => setNomeNovoTopico(e.target.value)} />
              <button type="submit">Adicionar</button>
            </form>
            <ul>
              {topicos.map((topico) => (
                <li key={topico.id} style={{ marginBottom: '10px' }}>
                  {editingTopicoId === topico.id ? (
                    <>
                      <input type="text" value={editingTopicoName} onChange={(e) => setEditingTopicoName(e.target.value)} />
                      <button onClick={() => handleSalvarEdicaoTopico(topico.id)}>Salvar</button>
                      <button onClick={() => setEditingTopicoId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span>{topico.nome}</span>
                      <button onClick={() => handleEntrarModoEdicaoTopico(topico)} style={{ marginLeft: '10px' }}>Editar</button>
                      <button onClick={() => handleDeletarTopico(topico.id)}>Excluir</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h2>Selecione uma disciplina para ver os tópicos</h2>
        )}
      </div>
    </div>
  );
}