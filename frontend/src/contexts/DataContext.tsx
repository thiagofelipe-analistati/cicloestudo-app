// src/contexts/DataContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Disciplina } from '../services/disciplinaService';
import { getAllDisciplinas } from '../services/disciplinaService';

interface DataContextType {
  disciplinas: Disciplina[];
  refetchData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  
  // Usamos useCallback para que a função não seja recriada a cada renderização
  const refetchData = useCallback(async () => {
    // Só busca os dados se o usuário estiver logado (token existe)
    if (localStorage.getItem('aprova-flow-token')) {
      try {
        const data = await getAllDisciplinas();
        setDisciplinas(data);
      } catch (error) {
        console.error("Falha ao buscar dados no DataProvider:", error);
        setDisciplinas([]);
      }
    }
  }, []);

  // Busca os dados na primeira vez que o provedor é montado
  useEffect(() => {
    refetchData();
  }, [refetchData]);

  const value = { disciplinas, refetchData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Hook customizado para consumir os dados
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};