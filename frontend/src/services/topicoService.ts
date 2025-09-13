// src/services/topicoService.ts
import api from './api';

export interface Topico {
  id: string;
  nome: string;
  comentarios?: string | null;
  // Adicione outros campos se necessário
}

// Buscar todos os tópicos de uma disciplina
export const getTopicosByDisciplina = async (disciplinaId: string): Promise<Topico[]> => {
  const response = await api.get(`/disciplinas/${disciplinaId}/topicos`);
  return response.data;
};

// Criar um novo tópico
export const createTopico = async (disciplinaId: string, nome: string): Promise<Topico> => {
  const response = await api.post(`/disciplinas/${disciplinaId}/topicos`, { nome });
  return response.data;
};

// Atualizar um tópico
export const updateTopico = async (topicoId: string, disciplinaId: string, nome: string): Promise<Topico> => {
  const response = await api.put(`/disciplinas/${disciplinaId}/topicos/${topicoId}`, { nome });
  return response.data;
};

// Deletar um tópico
export const deleteTopico = async (topicoId: string, disciplinaId: string): Promise<void> => {
  await api.delete(`/disciplinas/${disciplinaId}/topicos/${topicoId}`);
};