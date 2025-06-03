"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SportGroup } from "@/data/Odd";

interface OddsContextType {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  favoriteSports: string[];
  toggleFavoriteSport: (sportKey: string) => void;
  allSports: SportGroup[];
  setAllSports: (sports: SportGroup[]) => void;
}

const OddsContext = createContext<OddsContextType | undefined>(undefined);

interface OddsProviderProps {
  children: ReactNode;
  initialSports: SportGroup[];
}

export function OddsProvider({ children, initialSports }: OddsProviderProps) {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  const [allSports, setAllSports] = useState<SportGroup[]>(initialSports);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteSports");
    if (storedFavorites) {
      try {
        setFavoriteSports(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Falha ao analisar esportes favoritos do localStorage", e);
        setFavoriteSports([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteSports", JSON.stringify(favoriteSports));
  }, [favoriteSports]);

  const toggleFavoriteSport = (sportKey: string) => {
    setFavoriteSports((prevFavorites) => {
      if (prevFavorites.includes(sportKey)) {
        return prevFavorites.filter((key) => key !== sportKey);
      } else {
        return [...prevFavorites, sportKey];
      }
    });
  };

  const value = {
    selectedSport,
    setSelectedSport,
    favoriteSports,
    toggleFavoriteSport,
    allSports,
    setAllSports,
  };

  return <OddsContext.Provider value={value}>{children}</OddsContext.Provider>;
}

export function useOddsContext() {
  const context = useContext(OddsContext);
  if (context === undefined) {
    throw new Error("useOddsContext deve ser usado dentro de um OddsProvider");
  }
  return context;
}
