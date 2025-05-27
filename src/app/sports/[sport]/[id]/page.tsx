'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchOddById } from '@/app/lib/fetchOdds';
import { useRouter } from 'next/navigation';


export interface Outcome {
  name: string;
  price: number | string;
  point?: number;
  [key: string]: any;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
  [key: string]: any;
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
  [key: string]: any;
}

export interface OddData {
  id: string;
  sport_title: string;
  
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
  eventId: string;
  sport: string;
  status: 'live' | 'future' | 'finished' | string;
  league_name?: string;
  sport_key: string;
  [key: string]: any;
}


export default function Page() {
  const params = useParams();
  const oddId = params?.id as string;
  const sport = params?.sport as string;
  const [odd, setOdd] = useState<OddData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    async function loadOdd() {
     try {
    const data = await fetchOddById(sport, oddId);
    console.log("Dados recebidos de fetchOddById:", data);
    if (!data) {
        console.error("fetchOddById retornou nulo."); // <-- ADICIONE ESTE LOG
        setError("Não foi possível encontrar os detalhes do evento.");
        setLoading(false);
        return;
    }
    setOdd(data);
    setLoading(false);
} catch (err: any) {
    console.error("Erro na chamada fetchOddById:", err); // <-- ADICIONE ESTE LOG
    setError(err.message || 'Erro ao carregar detalhes da odd.');
    setLoading(false);
    console.error(err);
}
  } 
    loadOdd()
  }, [oddId, sport]);



  if (loading) return <div className="p-6">Carregando detalhes da odd...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!odd) return <div className="p-6 text-red-600">Odd não encontrada.</div>;

  const commenceDate = new Date(odd.commence_time);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {odd.home_team} vs {odd.away_team}
      </h1>

      <p className="text-gray-600 mb-2">
        <strong>Esporte:</strong> {odd.sport_title}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Data:</strong> {commenceDate.toLocaleString()}
      </p>
      {odd.league_name && (
        <p className="text-gray-600 mb-4">
          <strong>Campeonato:</strong> {odd.league_name}
        </p>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Odds disponíveis por casa de aposta:</h2>
        {odd.bookmakers?.map((bookmaker) => (
          <div key={bookmaker.key} className="mb-4 border p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">{bookmaker.title}</h3>
            {bookmaker.markets?.map((market) => (
              <div key={market.key} className="mb-2">
                <h4 className="text-md font-semibold mb-1">{market.key}</h4>
                {market.outcomes?.map((outcome) => (
                  <p key={outcome.name}>
                    {outcome.name}: <strong>{outcome.price}</strong>
                    {outcome.point !== undefined && ` (Ponto: ${outcome.point})`}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}