"use client";

import { SportGroup } from "@/data/Odd";
// Use suas tipagens unificadas
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
  allSports: SportGroup[]; // Agora os esportes são recebidos via prop
  // setAllSports: (sports: SportGroup[]) => void // Não precisamos de setAllSports aqui
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

interface OddsProviderProps {
  children: ReactNode;
  initialSports: SportGroup[]; // Dados de esportes vindos do servidor
}

export const OddsProvider = ({ children, initialSports }: OddsProviderProps) => {
  const [sortBy, setSortBy] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedChampionship, setSelectedChampionship] = useState("");
  // allSports agora é inicializado com a prop
  const [allSports] = useState<SportGroup[]>(initialSports);

  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
    // Isso é um pattern excelente para localStorage no estado inicial
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("favoriteSports");
        return stored ? JSON.parse(stored) : [];
      } catch {
        // Em caso de erro na leitura do localStorage
        console.error("Failed to parse favoriteSports from localStorage.");
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favoriteSports", JSON.stringify(favoriteSports));
    }
  }, [favoriteSports]);

  const toggleFavoriteSport = useCallback((sport: string) => {
    setFavoriteSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]));
  }, []); // Adicionado useCallback para otimização

  const applySportFilter = useCallback((sport: string) => {
    setSelectedSport(sport);
    setSelectedChampionship("");
  }, []); // Adicionado useCallback para otimização

  const applyChampionshipFilter = useCallback((championship: string) => {
    setSelectedChampionship(championship);
    setSelectedSport("");
  }, []); // Adicionado useCallback para otimização

  // A função loadSports e o useEffect relacionado foram REMOVIDOS daqui
  // A busca de esportes agora é feita no Server Component e passada via prop

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
        allSports,
        // setAllSports não é mais necessário, pois allSports é gerenciado internamente ou via prop
      }}
    >
      {children}
    </OddsContext.Provider>
  );
};

export const useOddsContext = () => {
  const context = useContext(OddsContext);
  if (!context) {
    throw new Error("useOddsContext deve ser usado dentro de um OddsProvider");
  }
  return context;
};
