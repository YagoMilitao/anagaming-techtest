'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';

type OddDetail = {
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  league_name: string;
  bookmakers: {
    key: string;
    markets: {
      outcomes: {
        name: string;
        price: number;
      }[];
    }[];
  }[];
};

export default function OddDetailPage() {
  const { id } = useParams();
  const [odd, setOdd] = useState<OddDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOdd() {
      try {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/${id}/odds/?apiKey=${process.env.ODDS_API_KEY}`);
        const data = await res.json();
        setOdd(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar os detalhes da odd:', error);
        setLoading(false);
      }
    }

    fetchOdd();
  }, [id]);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!odd) {
    return <div className="p-6">Odd não encontrada..</div>;
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{odd.home_team} vs {odd.away_team}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <FaTrophy className="mr-2" />
          <span>{odd.league_name}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>{new Date(odd.commence_time).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2" />
          <span>{new Date(odd.commence_time).toLocaleTimeString()}</span>
        </div>

        <h2 className="text-xl font-semibold mb-2">Odds</h2>
        {odd.bookmakers.map((bookmaker) => (
          <div key={bookmaker.key} className="mb-4">
            <h3 className="text-lg font-medium">{bookmaker.key}</h3>
            {bookmaker.markets.map((market, index) => (
              <div key={index} className="flex space-x-4 mt-2">
                {market.outcomes.map((outcome, idx) => (
                  <div key={idx} className="bg-gray-100 p-2 rounded">
                    <span className="block font-medium">{outcome.name}</span>
                    <span className="text-blue-600">{outcome.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
