'use client';

import React, { useEffect, useState } from "react";
import { fetchOddsData } from "../lib/fetchOdds";
import { useOddsContext } from "../context/OddsContext";
import UserPanel from "./UserPanel";
import OddsList from "./Odds/OddsList";
import FilterBar from "./FilterBar";
import OddsFilter from "./Odds/OddsFilter";

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

  if (loading) return <div className="p-6">Carregando...</div>;

  const sports = Array.from(new Set(odds.map((o: any) => o.sport_title)));

  const sortedSports = [
    ...sports.filter((s) => favoriteSports.includes(s)),
    ...sports.filter((s) => !favoriteSports.includes(s)),
  ];

  const filteredOdds = selectedSport
    ? odds.filter((odd) => odd.sport_title === selectedSport)
    : odds;

  return (
    <main className="p-6">
      <UserPanel session={session} />
      <h1 className="text-2xl font-bold my-4">Apostas ao Vivo</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {sortedSports.map((sport) => {
          const isFavorite = favoriteSports.includes(sport);
          return (
            <div key={sport} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1 rounded border ${
                  selectedSport === sport
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                {sport}
              </button>
              <button onClick={() => toggleFavoriteSport(sport)}>
                {isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          );
        })}
      </div>

      <FilterBar sports={sports} />
      <OddsFilter />
      <OddsList odds={filteredOdds || []} />
    </main>
  );
}
