'use client';

import React from "react";
import { useOddsContext } from "@/app/context/OddsContext";

interface Props {
  odds: any[];
}

export default function ChampionshipFilter({ odds }: Props) {
  const {
    selectedSport,
    selectedChampionship,
    setSelectedChampionship,
  } = useOddsContext();

  if (!selectedSport) return null;

  // Extrair e ordenar campeonatos únicos com base no esporte selecionado
  const championships = Array.from(
    new Set(
      odds
        .filter((o) => o.sport_title === selectedSport)
        .map((o) => o.league_name || o.league_title || "Outro Campeonato")
    )
  ).sort((a, b) => a.localeCompare(b));

  // Se não houver campeonatos, não renderizar nada
  if (championships.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {championships.map((champ) => (
        <button
          key={champ}
          onClick={() => setSelectedChampionship(champ)}
          className={`px-3 py-1 rounded border transition-all ${
            selectedChampionship === champ
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {champ}
        </button>
      ))}
      {selectedChampionship && (
        <button
          onClick={() => setSelectedChampionship("")}
          className="ml-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          Limpar filtro de campeonato
        </button>
      )}
    </div>
  );
}
