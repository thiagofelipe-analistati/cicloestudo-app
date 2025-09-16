import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas } from '../services/disciplinaService';

interface DataContextType {
  disciplinas: Disciplina[];
  refetchData: () => void;
  refetchKey: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);

  const refetchData = useCallback(async () => {
    if (localStorage.getItem('aprova-flow-token')) {
      try {
        const data = await getAllDisciplinas();
        setDisciplinas(data);
        setRefetchKey(prev => prev + 1); // incrementa a chave a cada refetch
      } catch (error) {
        console.error("Falha ao buscar dados no DataProvider:", error);
        setDisciplinas([]);
      }
    }
  }, []);

  useEffect(() => {
    refetchData();
  }, [refetchData]);

  const value = { disciplinas, refetchData, refetchKey };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
};
