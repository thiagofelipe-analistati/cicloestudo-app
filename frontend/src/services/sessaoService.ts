// ARQUIVO: frontend/src/services/sessaoService.ts
import api from './api';

export interface SessaoEstudo {
  id: string;
  data: Date;
  tempoEstudado: number;
  categoria: string;
  totalQuestoes?: number | null;
  acertosQuestoes?: number | null;
  errosQuestoes?: number | null;
  disciplina: { nome: string };
  topico?: { nome: string } | null;
}

export interface CreateSessaoPayload {
  data: string | Date;
  tempoEstudado: number;
  categoria: string;
  disciplinaId: string;
  topicoId: string | null;
  totalQuestoes: number;
  acertosQuestoes: number;
  errosQuestoes: number;
  concluiuTopico?: boolean;
  agendarRevisao?: boolean;
  revisaoId?: string; // Adicionamos este campo anteriormente
}

export const createSessaoEstudo = async (data: CreateSessaoPayload) => {
  const response = await api.post('/sessoes', data);
  return response.data;
};

// CORREÇÃO APLICADA AQUI
export const getAllSessoes = async (filters: {
  disciplinaId?: string;
  // Alterado de Date para string para corresponder ao que o formulário envia
  dataInicio?: string; 
  dataFim?: string;
}): Promise<SessaoEstudo[]> => {
  const response = await api.get('/sessoes', { params: filters });
  return response.data;
};