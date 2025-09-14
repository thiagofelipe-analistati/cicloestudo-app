// src/services/sessaoService.ts
import api from './api';

// Este tipo precisa ser exportado para ser usado em outras páginas
export interface SessaoEstudo {
  id: string;
  data: Date;
  tempoEstudado: number;
  categoria: string;
  totalQuestoes?: number | null;
  acertosQuestoes?: number | null;
  errosQuestoes?: number | null;
  disciplina: { nome: string }; // Incluímos o nome da disciplina
  topico?: { nome: string } | null; // e o nome do tópico
}

export const createSessaoEstudo = async (data: any) => {
  const dataToSend = {
    ...data,
    tempoEstudado: Number(data.tempoEstudado),
    totalQuestoes: Number(data.totalQuestoes),
    acertosQuestoes: Number(data.acertosQuestoes),
    errosQuestoes: Number(data.errosQuestoes),
    topicoId: data.topicoId || null,
  };
  const response = await api.post('/sessoes', dataToSend);
  return response.data;
};

// Nova função para buscar sessões com filtros
export const getAllSessoes = async (filters: {
  disciplinaId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}): Promise<SessaoEstudo[]> => {
  const response = await api.get('/sessoes', { params: filters });
  return response.data;
};