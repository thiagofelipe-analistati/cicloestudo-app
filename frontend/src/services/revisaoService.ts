// ARQUIVO: frontend/src/services/revisaoService.ts

import api from './api';

export interface Revisao {
  id: string;
  dataAgendada: string;
  status: 'PENDENTE' | 'CONCLUIDA' | 'ATRASADA';
  atrasada: boolean; // <-- Novo campo
  topico: {
    id: string;
    nome: string;
    disciplina: {
      id: string;
      nome: string;
    };
  };
}

export interface RevisoesResponse {
  revisoes: Revisao[];
  stats: {
    total: number;
    atrasadas: number;
    paraHoje: number;
  };
}

export const getRevisoesPendentes = async (): Promise<RevisoesResponse> => {
  const response = await api.get('/revisoes');
  return response.data;
};

export const getRevisoesDeHoje = async (): Promise<Revisao[]> => {
  const response = await api.get('/revisoes/hoje');
  return response.data;
}

export const marcarRevisaoComoConcluida = async (revisaoId: string): Promise<void> => {
  await api.patch(`/revisoes/${revisaoId}/concluir`);
};