"use client";

import { SportGroup } from "@/data/Odd";
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
  allSports: SportGroup[];
};

const OddsContext = createContext<OddsContextType | undefined>(undefined);

interface OddsProviderProps {
  children: ReactNode;
  initialSports: SportGroup[];
}

export const OddsProvider = ({ children, initialSports }: OddsProviderProps) => {
  const [sortBy, setSortBy] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedChampionship, setSelectedChampionship] = useState("");
  const [allSports] = useState<SportGroup[]>(initialSports);
  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("favoriteSports");
        return stored ? JSON.parse(stored) : [];
      } catch {
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
  }, []);

  const applySportFilter = useCallback((sport: string) => {
    setSelectedSport(sport);
    setSelectedChampionship("");
  }, []);

  const applyChampionshipFilter = useCallback((championship: string) => {
    setSelectedChampionship(championship);
    setSelectedSport("");
  }, []);

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
