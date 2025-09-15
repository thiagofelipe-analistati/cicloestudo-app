// src/contexts/DataContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas } from '../services/disciplinaService';

interface DataContextType {
  disciplinas: Disciplina[];
  refetchData: () => void;
  refetchKey: number; // Adicionamos a chave aqui
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);

  const refetchData = useCallback(() => {
    setRefetchKey(prevKey => prevKey + 1);
  }, []);

  useEffect(() => {
    getAllDisciplinas().then(setDisciplinas).catch(() => setDisciplinas([]));
  }, [refetchKey]); // Busca as disciplinas sempre que a chave mudar

  const value = { disciplinas, refetchData, refetchKey };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};