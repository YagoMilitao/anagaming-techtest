'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type OddsContextType = {
  sport: string;
  setSport: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  favoriteSports: string[];
  toggleFavoriteSport: (sport: string) => void;
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

export const OddsProvider = ({ children }: { children: ReactNode }) => {
  const [sport, setSport] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  /*const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  // Function to toggle a sport in the favorites list
  const toggleFavoriteSport = (sport: string) => {
    setFavoriteSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };*/
  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('favoriteSports') || '[]');
  }
  return [];
});

const toggleFavoriteSport = (sport: string) => {
  setFavoriteSports(prev => {
    const updated = prev.includes(sport)
      ? prev.filter(s => s !== sport)
      : [...prev, sport];
    localStorage.setItem('favoriteSports', JSON.stringify(updated));
    return updated;
  });
};

  return (
    <OddsContext.Provider value={{ sport, setSport, sortBy, setSortBy, selectedSport, setSelectedSport, favoriteSports, toggleFavoriteSport }}>
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
