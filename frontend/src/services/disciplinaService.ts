// src/services/disciplinaService.ts
import api from './api';

export interface Disciplina {
  id: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllDisciplinas = async (): Promise<Disciplina[]> => {
  const response = await api.get('/disciplinas');
  return response.data;
};

// A sintaxe nesta função foi corrigida
export const createDisciplina = async (nome: string): Promise<Disciplina> => {
  const response = await api.post('/disciplinas', { nome });
  return response.data;
};

// Função para atualizar uma disciplina
export const updateDisciplina = async (id: string, nome: string): Promise<Disciplina> => {
  const response = await api.put(`/disciplinas/${id}`, { nome });
  return response.data;
};

// Função para deletar uma disciplina
export const deleteDisciplina = async (id: string): Promise<void> => {
  await api.delete(`/disciplinas/${id}`);
};