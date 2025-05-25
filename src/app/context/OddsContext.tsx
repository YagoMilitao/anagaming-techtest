'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type OddsContextType = {
  sport: string;
  setSport: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

export const OddsProvider = ({ children }: { children: ReactNode }) => {
  const [sport, setSport] = useState('');
  const [sortBy, setSortBy] = useState('');
  return (
    <OddsContext.Provider value={{ sport, setSport, sortBy, setSortBy }}>
      {children}
    </OddsContext.Provider>
  );
};

export const useOddsContext = () => {
  const context = useContext(OddsContext);
  if (!context) throw new Error('useOddsContext must be used within OddsProvider');
  return context;
};
