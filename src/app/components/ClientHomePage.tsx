'use client';

import React, { useEffect, useState } from "react";
import { fetchOddsData } from "../lib/fetchOdds";
import { useOddsContext } from "../context/OddsContext";
import UserPanel from "./UserPanel";
import OddsList from "./Odds/OddsList";
import FilterBar from "./FilterBar";
import OddsFilter from "./Odds/OddsFilter";
import DropdownAccordion from "./DropdownAccordion";
import { orderBy } from "lodash";
import StatusDot from "./StatusDot";

export default function ClientHomePage({ session }: { session: any }) {
  const [loading, setLoading] = useState(true);
  const [odds, setOdds] = useState<any[]>([]);

  const {
    selectedSport,
    setSelectedSport,
    favoriteSports,
    toggleFavoriteSport,
  } = useOddsContext();

  useEffect(() => {
    async function loadOdds() {
      const fetchOdds = await fetchOddsData();
      setOdds(fetchOdds);
      setLoading(false);
    }
    loadOdds();
  }, []);

  if (loading) return <div className="p-6">Carregando...</div>

  

  // Filtrar odds pelo esporte selecionado (se houver)
  const filteredOdds = selectedSport
    ? odds.filter((odd) => odd.sport_title === selectedSport)
    : odds;

  const now = Date.now()

  // Separar os jogos
  const liveGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    // Considera jogo ao vivo se começou e não passou mais que 3 horas (ajuste conforme duração média)
    return start <= now && now <= start + 3 * 60 * 60 * 1000;
  });

  const futureGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return start > now;
  });

  const finishedGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return start + 3 * 60 * 60 * 1000 < now; // já passou do limite de duração
  });

  function sortByCommenceTimeAsc(games: any[]) {
    return [...games].sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
  }

  function sortByCommenceTimeDesc(games: any[]) {
    return [...games].sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime());
  }

  // Ordenar cada lista pela data (mais próxima primeiro)
  const sortByCommenceTime = (games: any[]) =>
    orderBy(games, [(g) => new Date(g.commence_time).getTime()], ['asc']);

  const sortedLiveGames = sortByCommenceTimeAsc(liveGames);
  const sortedFutureGames = sortByCommenceTimeAsc(futureGames);
  const sortedFinishedGames = sortByCommenceTimeDesc(finishedGames);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <UserPanel session={session} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apostas ao Vivo</h1>

        {favoriteSports.length > 0 && (
          <button
            onClick={() => {
              // Limpa todas as categorias favoritas
              favoriteSports.forEach((sport) => toggleFavoriteSport(sport));
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            aria-label="Limpar categorias favoritas"
          >
            Limpar categorias favoritas
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from(new Set(odds.map((o) => o.sport_title))).map((sport) => {
          const isFavorite = favoriteSports.includes(sport);
          return (
            <div key={sport} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1 rounded border ${
                  selectedSport === sport
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {sport}
              </button>
              <button
                onClick={() => toggleFavoriteSport(sport)}
                aria-label={`Favoritar esporte ${sport}`}
              >
                {isFavorite ? "⭐" : "☆"}
              </button>
            </div>
          );
        })}
        {/* Botão para limpar selectedSport */}
        {selectedSport && (
          <button
            onClick={() => setSelectedSport("")}	
            className="ml-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
          >
            Limpar filtro de esporte
          </button>
        )}
      </div>

      <FilterBar sports={Array.from(new Set(odds.map((o) => o.sport_title)))} />
      <OddsFilter />

      <DropdownAccordion
        title={
          <div className="flex items-center gap-2">
            
            <span>Jogos Ao Vivo</span>
          </div>
        }
        defaultOpen
        count={sortedLiveGames.length}
        status="live"
      >
        <OddsList odds={sortedLiveGames} />
      </DropdownAccordion>

      <DropdownAccordion
        title={
          <div className="flex items-center gap-2">
           
            <span>Jogos Futuros</span>
          </div>
        }
        defaultOpen
        count={sortedFutureGames.length}
        status="future"
      >
        <OddsList odds={sortedFutureGames} />
      </DropdownAccordion>

      <DropdownAccordion
        title={
         <div className="flex items-center gap-2">
           
           <span>Jogos Encerrados</span>
         </div>
        }
        count={sortedFinishedGames.length}
        status="finished"
      >
        <OddsList odds={sortedFinishedGames} />
      </DropdownAccordion>
    </main>
  );
}
