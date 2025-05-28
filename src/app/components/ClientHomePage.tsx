'use client';

import React, { useEffect, useState } from "react";
import { fetchOddsData } from "../lib/fetchOdds";
import { useOddsContext } from "../context/OddsContext";
import UserPanel from "./UserPanel";
import OddsList from "./Odds/OddsList";
import DropdownAccordion from "./DropdownAccordion";
import { orderBy } from "lodash";
import SportsFilter from "./Filters/SportsFilter";

export default function ClientHomePage({ session }: { session: any }) {
  const [loading, setLoading] = useState(true);
  const [odds, setOdds] = useState<any[]>([]); // Mantive 'any[]' pois a estrutura exata depende da resposta de fetchOddsData

  const {
    selectedChampionship,
    setSelectedChampionship,
    selectedSport,
    setSelectedSport,
    favoriteSports,
    toggleFavoriteSport,
    allSports,
    setAllSports,
  } = useOddsContext();

  useEffect(() => {
    // Função assíncrona para carregar as odds ao montar o componente
    async function loadOdds() {
      const fetchOdds = await fetchOddsData();
      setOdds(fetchOdds);
      setLoading(false);
    }
    loadOdds();
  }, []); // Executa apenas uma vez na montagem do componente

  // Enquanto os dados estão carregando, exibe uma mensagem
  if (loading) return <div className="p-6">Carregando...</div>

  // Filtra os esportes selecionados com base no contexto
  const selectedGroup = allSports.find((g) => g.group === selectedSport);
  const selectedKeys = selectedGroup ? selectedGroup.keys : [];

  const filteredOdds = selectedKeys.length > 0
    ? odds.filter((odd) => selectedKeys.includes(odd.sport_key))
    : odds;

  const now = Date.now();

  // Separa os jogos em ao vivo, futuros e encerrados com base no tempo de início
  const liveGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    // Considera jogo ao vivo se começou e não passou mais que 3 horas
    return start <= now && now <= start + 3 * 60 * 60 * 1000;
  });

  const futureGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return start > now;
  });

  const finishedGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return start + 3 * 60 * 60 * 1000 < now; // Já passou do limite de duração
  });

  // Filtra as odds com base no esporte e campeonato selecionados
  const filteredSportOdds = odds.filter((odd) => {
    const matchesSport = selectedSport ? odd.sport_title === selectedSport : true;
    const matchesChamp = selectedChampionship ? odd.league_name === selectedChampionship : true;
    return matchesSport && matchesChamp;
  });

  // Funções para ordenar os jogos por tempo de início (ascendente e descendente)
  function sortByCommenceTimeAsc(games: any[]) {
    return [...games].sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
  }

  function sortByCommenceTimeDesc(games: any[]) {
    return [...games].sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime());
  }

  // Ordenar cada lista de jogos
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
        <SportsFilter />
      </div>

      {/* Renderiza as listas de odds em componentes DropdownAccordion */}
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