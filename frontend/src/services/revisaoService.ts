// ARQUIVO: frontend/src/services/revisaoService.ts

import api from './api';

export interface Revisao {
  id: string;
  dataAgendada: string;
  status: 'PENDENTE' | 'CONCLUIDA' | 'ATRASADA';
  topico: {
    nome: string;
    disciplina: {
      nome: string;
    };
  };
}

export const getRevisoesPendentes = async (): Promise<Revisao[]> => {
  const response = await api.get('/revisoes');
  return response.data;
};

export const marcarRevisaoComoConcluida = async (revisaoId: string): Promise<void> => {
  await api.patch(`/revisoes/${revisaoId}/concluir`);
};