import api from './api';

export interface CicloItem {
  id: string;
  ordem: number;
  tempoMinutos: number;
  disciplina: { id: string; nome: string; };
}
export interface CicloItemComProgresso extends CicloItem {
  tempoEstudadoMinutos: number;
}
export interface CicloComProgresso extends Omit<Ciclo, 'itens'> {
  itens: CicloItemComProgresso[];
}
export interface Ciclo {
  id: string;
  nome: string;
  ativo: boolean;
  itens: CicloItem[];
}
export const getAllCiclos = async (): Promise<Ciclo[]> => {
  try {
    const response = await api.get('/ciclos');
    return response.data || [];
  } catch (error) {
    console.error("API Error: getAllCiclos", error);
    return [];
  }
};
export const createCiclo = async (nome: string): Promise<Ciclo> => {
  const response = await api.post('/ciclos', { nome });
  return response.data;
};
export const addItemAoCiclo = async (cicloId: string, disciplinaId: string, tempoMinutos: number): Promise<CicloItem> => {
  const response = await api.post(`/ciclos/${cicloId}/items`, { disciplinaId, tempoMinutos });
  return response.data;
};
export const removeItemDoCiclo = async (itemId: string): Promise<void> => {
  await api.delete(`/ciclos/items/${itemId}`);
};
export const updateCiclo = async (cicloId: string, nome: string): Promise<void> => {
  await api.put(`/ciclos/${cicloId}`, { nome });
};

export const deleteCiclo = async (cicloId: string): Promise<void> => {
  await api.delete(`/ciclos/${cicloId}`);
};
export const reorderCicloItens = async (cicloId: string, itens: { id: string; ordem: number }[]): Promise<void> => {
  await api.patch(`/ciclos/${cicloId}/items/reorder`, { itens });
};
export const getActiveCicloStatus = async (): Promise<Ciclo | null> => {
  try {
    const response = await api.get('/ciclos/ativo/status');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar status do ciclo ativo:", error);
    return null;
  }
};