// src/services/disciplinaService.ts
import api from './api';

export interface Disciplina {
  id: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllDisciplinas = async (): Promise<Disciplina[]> => {
  try {
    const response = await api.get('/disciplinas');
    // Se a resposta for bem-sucedida e os dados forem uma lista, retorne-os
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // Se a API retornar algo que não é uma lista, retorne uma lista vazia por segurança
    console.error("API não retornou uma lista de disciplinas:", response.data);
    return [];
  } catch (error) {
    console.error("Erro no serviço getAllDisciplinas:", error);
    return []; // Retorna uma lista vazia em caso de erro de rede ou outros
  }
};

// ... (o restante das suas funções de serviço, como create, update, delete, etc.)
// Mantenha o resto do seu arquivo como está.
export const createDisciplina = async (nome: string): Promise<Disciplina> => {
  const response = await api.post('/disciplinas', { nome });
  return response.data;
};

export const updateDisciplina = async (id: string, nome: string): Promise<Disciplina> => {
  const response = await api.put(`/disciplinas/${id}`, { nome });
  return response.data;
};

export const deleteDisciplina = async (id: string): Promise<void> => {
  await api.delete(`/disciplinas/${id}`);
};

export interface DisciplinaSummary {
  id: string;
  nome: string;
  tempoTotal: number;
  questoesTotal: number;
  acertosTotal: number;
}

export const getDisciplinasSummary = async (): Promise<DisciplinaSummary[]> => {
  try {
    const response = await api.get('/disciplinas/summary');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch(error) {
    console.error("Erro no serviço getDisciplinasSummary:", error);
    return [];
  }
};