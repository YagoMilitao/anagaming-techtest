'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Outcome {
  name: string;
  price: number | string;
  [key: string]: any;
}

interface Market {
  outcomes: Outcome[];
  [key: string]: any;
}

interface Bookmaker {
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
  status: 'live' | 'future' | 'finished';
  [key: string]: any;
}

interface OddDetailsProps {}

export default function OddDetails(props: OddDetailsProps) {
  const params = useParams();
  const oddId = params?.id as string;
  const sport = params?.sport as string;
  const eventId = params?.eventId as string;
  const [odd, setOdd] = useState<OddData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOdd() {
      if (!oddId) return;
      try {
        const data = await fetchOddById(sport)
        setOdd(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes da odd.');
        setLoading(false);
        console.error(err);
      }
    }
    loadOdd();
  }, [oddId]);

  if (loading) return <div className="p-6">Carregando detalhes da odd...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!odd) return <div className="p-6 text-red-600">Odd não encontrada.</div>;

  const commenceDate = new Date(odd.commence_time);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Detalhes da Odd</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{odd.sport_title}</h2>
        <p><strong>Evento:</strong> {odd.home_team} vs {odd.away_team}</p>
        <p><strong>Data e hora:</strong> {commenceDate.toLocaleString()}</p>
        <p><strong>Status:</strong> {odd.status}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Bookmakers e Odds</h3>
        {odd.bookmakers?.length === 0 && <p>Nenhum bookmaker disponível para essa odd.</p>}
        {odd.bookmakers?.map((bookmaker: Bookmaker) => (
          <div key={bookmaker.key} className="mb-4 border p-3 rounded-md bg-gray-50">
            <h4 className="font-semibold">{bookmaker.title}</h4>
            <ul className="list-disc list-inside">
              {bookmaker.markets?.map((market: Market) =>
                market.outcomes.map((outcome: Outcome) => (
                  <li key={outcome.name}>
                    {outcome.name}: <strong>{outcome.price}</strong>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

async function fetchOddById(oddId: string): Promise<OddData> {
  const response = await fetch(`/api/odds/${oddId}`);
  if (!response.ok) {
    const message = `Erro ao buscar odd com ID ${oddId}: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  return data as OddData;
}