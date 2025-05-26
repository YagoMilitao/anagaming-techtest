'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // se usar Next.js 13+ com app router


interface OddDetailsProps {}

interface OddData {
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: any[]; // Pode refinar conforme seu modelo
  status: 'live' | 'future' | 'finished';
  [key: string]: any; // outros dados possíveis
}

export default function OddDetails(props: OddDetailsProps) {
  const params = useParams();
  const oddId = params?.id as string; // captura o id da rota
  const [odd, setOdd] = useState<OddData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOdd() {
      if (!oddId) return;
      const data = await fetchOddById(oddId);
      setOdd(data);
      setLoading(false);
    }
    loadOdd();
  }, [oddId]);

  if (loading) return <div className="p-6">Carregando detalhes da odd...</div>;
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
        {odd.bookmakers.length === 0 && <p>Nenhum bookmaker disponível para essa odd.</p>}
        {odd.bookmakers.map((bookmaker) => (
          <div key={bookmaker.key} className="mb-4 border p-3 rounded-md bg-gray-50">
            <h4 className="font-semibold">{bookmaker.title}</h4>
            <ul className="list-disc list-inside">
              {bookmaker.markets.map((market) =>
                market.outcomes.map((outcome: any) => (
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
function fetchOddById(oddId: string) {
    throw new Error('Function not implemented.');
}

