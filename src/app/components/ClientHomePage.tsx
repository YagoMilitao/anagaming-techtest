'use client';

import React, { useEffect, useState } from "react";
import { fetchOddsData } from "../lib/fetchOdds";
import { useOddsContext } from "../context/OddsContext";
import UserPanel from "./User/UserPanel";
import DropdownAccordion from "./DropdownAccordion";
import SportsFilter from "./Filters/SportsFilter";
import { Session } from "next-auth";
import OddsSkeleton from "./OddsSkeleton";
import { OddData } from "@/data/Odd";
import OddsList from "./Odds/OddsList";
import LoginButton from "./User/LoginButton";

export default function ClientHomePage({ session }: { session: Session | null }) {
  const [loading, setLoading] = useState(true);
  const [odds, setOdds] = useState<OddData[]>([]);

  const {
    selectedSport,
    favoriteSports,
    toggleFavoriteSport,
    allSports,
  } = useOddsContext();

  useEffect(() => {
    async function loadOdds() {
      try {
        const fetchedOdds = await fetchOddsData();
        if (Array.isArray(fetchedOdds)) {
          setOdds(fetchedOdds);
        } else {
          console.error("fetchOddsData retornou dados em formato inesperado:", fetchedOdds);
          setOdds([]);
        }
      } catch (error) {
        console.error("Erro ao carregar odds:", error);
        setOdds([]);
      } finally {
        setLoading(false);
      }
    }
    loadOdds();
  }, []);

  if (loading) {
    return <OddsSkeleton />;
  }

  const selectedGroup = allSports.find((g) => g.group === selectedSport);
  const selectedKeys: string[] = selectedGroup ? selectedGroup.keys : [];

  const filteredOdds = selectedKeys.length > 0
    ? odds.filter((odd) => selectedKeys.includes(odd.sport_key))
    : odds;

  const now = Date.now();

  const liveGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return !isNaN(start) && start <= now && now <= start + 3 * 60 * 60 * 1000;
  });

  const futureGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return !isNaN(start) && start > now;
  });

  const finishedGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime();
    return !isNaN(start) && start + 3 * 60 * 60 * 1000 < now;
  });

  function sortByCommenceTimeAsc(games: OddData[]): OddData[] {
    return [...games].sort((a, b) => {
      const timeA = new Date(a.commence_time).getTime();
      const timeB = new Date(b.commence_time).getTime();
      return (isNaN(timeA) ? 1 : timeA) - (isNaN(timeB) ? 1 : timeB);
    });
  }

  function sortByCommenceTimeDesc(games: OddData[]): OddData[] {
    return [...games].sort((a, b) => {
      const timeA = new Date(a.commence_time).getTime();
      const timeB = new Date(b.commence_time).getTime();
      return (isNaN(timeB) ? 1 : timeB) - (isNaN(timeA) ? 1 : timeA);
    });
  }

  const sortedLiveGames = sortByCommenceTimeAsc(liveGames);
  const sortedFutureGames = sortByCommenceTimeAsc(futureGames);
  const sortedFinishedGames = sortByCommenceTimeDesc(finishedGames);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      {session ? (
        <UserPanel session={session} />
      ) : (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo à Anagaming!</h1>
          <p className="mb-2 text-gray-700">Explore as odds ao vivo abaixo. Faça login para acessar recursos como favoritos.</p>
          <LoginButton />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Apostas ao Vivo</h2>
        {session && favoriteSports.length > 0 && (
          <button
            onClick={() => {
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

      <DropdownAccordion
        title={<span>Jogos Ao Vivo</span>}
        defaultOpen
        count={sortedLiveGames.length}
        status="live"
      >
        <OddsList odds={sortedLiveGames} />
      </DropdownAccordion>

      <DropdownAccordion
        title={<span>Jogos Futuros</span>}
        defaultOpen
        count={sortedFutureGames.length}
        status="future"
      >
        <OddsList odds={sortedFutureGames} />
      </DropdownAccordion>

      <DropdownAccordion
        title={<span>Jogos Encerrados</span>}
        count={sortedFinishedGames.length}
        status="finished"
      >
        <OddsList odds={sortedFinishedGames} />
      </DropdownAccordion>
    </main>
  );
}
