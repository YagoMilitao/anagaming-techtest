// src/hooks/useFavoriteSports.ts
import { useState, useEffect } from "react";

export function useFavoriteSports() {
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);

  // Ao montar o componente, carrega os favoritos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favoriteSports");
    if (stored) {
      try {
        setFavoriteSports(JSON.parse(stored));
      } catch {
        setFavoriteSports([]);
      }
    }
  }, []);

  // Função para adicionar/remover favorito e salvar no localStorage
  const toggleFavoriteSport = (sport: string) => {
    setFavoriteSports((prev) => {
      let updated: string[];
      if (prev.includes(sport)) {
        updated = prev.filter((s) => s !== sport);
      } else {
        updated = [...prev, sport];
      }
      localStorage.setItem("favoriteSports", JSON.stringify(updated));
      return updated;
    });
  };

  return { favoriteSports, toggleFavoriteSport };
}
