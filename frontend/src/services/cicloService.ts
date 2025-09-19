// src/services/cicloService.ts
import api from './api';

export interface CicloItem {
  id: string;
  ordem: number;
  tempoMinutos: number;
  disciplina: {
    id: string;
    nome: string;
  }
}

export interface Ciclo {
  id: string;
  nome: string;
  ativo: boolean;
  itens: CicloItem[];
}

export const getAllCiclos = async (): Promise<Ciclo[]> => {
  const response = await api.get('/ciclos');
  console.log("Resposta bruta da API /ciclos:", response.data); // 👈 loga antes de tratar
  const data = response.data;

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.ciclos)) return data.ciclos;

  console.error("Formato inesperado da API:", data);
  return [];
};


export const createCiclo = async (nome: string): Promise<Ciclo> => {
  const response = await api.post('/ciclos', { nome });
  return response.data;
};

export const addItemAoCiclo = async (
  cicloId: string, 
  disciplinaId: string, 
  tempoMinutos: number
): Promise<CicloItem> => {
  const response = await api.post(`/ciclos/${cicloId}/items`, { disciplinaId, tempoMinutos });
  return response.data;
};

export const removeItemDoCiclo = async (itemId: string): Promise<void> => {
  await api.delete(`/ciclos/items/${itemId}`);
};