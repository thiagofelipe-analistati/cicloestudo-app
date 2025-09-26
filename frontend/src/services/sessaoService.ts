// src/services/sessaoService.ts
import api from './api';

// Este tipo representa uma sessão que VEM da API (usado em listas, etc)
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

// NOVO: Este tipo representa os dados que ENVIAMOS para a API para criar uma sessão
export interface CreateSessaoPayload {
  data: string | Date;
  tempoEstudado: number;
  categoria: string;
  disciplinaId: string;
  topicoId: string | null;
  totalQuestoes: number;
  acertosQuestoes: number;
  errosQuestoes: number;
  concluiuTopico?: boolean;  // <-- Propriedade opcional
  agendarRevisao?: boolean;  // <-- Propriedade opcional
}


// A função agora usa o novo tipo, garantindo que só os dados corretos sejam enviados
export const createSessaoEstudo = async (data: CreateSessaoPayload) => {
  // A lógica de conversão e adição de campos já foi feita no componente,
  // então aqui apenas enviamos os dados para a API.
  const response = await api.post('/sessoes', data);
  return response.data;
};

// A função de buscar sessões continua a mesma
export const getAllSessoes = async (filters: {
  disciplinaId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}): Promise<SessaoEstudo[]> => {
  const response = await api.get('/sessoes', { params: filters });
  return response.data;
};