'use client';

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import OddsList from "./components/Odds/OddsList";
import { fetchOddsData } from "./lib/fetchOdds";
import UserPanel from "./components/UserPanel";
import { useOddsContext } from "./context/OddsContext";

export default function HomePage() {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const {
    selectedSport,
    setSelectedSport,
    favoriteSports,
    toggleFavoriteSport,
  } = useOddsContext();

  useEffect(() => {
    async function loadOdds() {
      const res = await fetchOddsData();
      setOdds(res);
      setLoading(false);
    }
    loadOdds();

    async function loadSession() {
      const { getSession } = await import("next-auth/react");
      const sess = await getSession();
      setSession(sess);
    }
    loadSession();
  }, []);

  if (typeof window !== 'undefined' && !localStorage.getItem('next-auth.session-token')) {
    redirect("/api/auth/signin");
  }

  if (loading || session === null) return <div className="p-6">Carregando...</div>;

  
  const sports = Array.from(new Set(odds.map((o: any) => o.sport_title)));

  
  const sortedSports = [
    ...sports.filter((s) => favoriteSports.includes(s)),
    ...sports.filter((s) => !favoriteSports.includes(s)),
  ];
  
  const filteredOdds = selectedSport
    ? odds.filter((odd: any) => odd.sport_title === selectedSport)
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

      {/* Lista filtrada de odds */}
      <OddsList odds={filteredOdds} />
    </main>
  );
}
