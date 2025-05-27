'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type OddsContextType = {
  selectedChampionship: string;
  setSelectedChampionship: (championship: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  applySportFilter: (sport: string) => void;
  applyChampionshipFilter: (championship: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  favoriteSports: string[];
  toggleFavoriteSport: (sport: string) => void;
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

export const OddsProvider = ({ children }: { children: ReactNode }) => {
  const [sortBy, setSortBy] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedChampionship, setSelectedChampionship] = useState('');

  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('favoriteSports');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteSports', JSON.stringify(favoriteSports));
    }
  }, [favoriteSports]);

  const toggleFavoriteSport = (sport: string) => {
    setFavoriteSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const applySportFilter = (sport: string) => {
    setSelectedSport(sport);
    setSelectedChampionship('');
  };

  const applyChampionshipFilter = (championship: string) => {
    setSelectedChampionship(championship);
    setSelectedSport('');
  };

  return (
    <OddsContext.Provider
      value={{
        selectedChampionship,
        setSelectedChampionship,
        selectedSport,
        setSelectedSport,
        applySportFilter,
        applyChampionshipFilter,
        sortBy,
        setSortBy,
        favoriteSports,
        toggleFavoriteSport,
      }}
    >
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
