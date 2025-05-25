'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type OddsContextType = {
  sport: string;
  setSport: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

export const OddsProvider = ({ children }: { children: ReactNode }) => {
  const [sport, setSport] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  return (
    <OddsContext.Provider value={{ sport, setSport, sortBy, setSortBy,selectedSport, setSelectedSport }}>
      {children}
    </OddsContext.Provider>
  );
};

export const useOddsContext = () => {
  const context = useContext(OddsContext);
  if (!context) {
    throw new Error('useOddsContext deve ser usado dentro de um OddsProvider');
  }
  return context;
};
