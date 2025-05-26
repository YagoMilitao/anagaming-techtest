'use client';


import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/formatDate';
import _ from 'lodash';
import { useOddsContext } from '@/app/context/OddsContext';

type Site = {
  site_key: string;
  site_nice: string;
  odds: {
    h2h?: number[];
    spreads?: { points: number[]; odds: number[] };
    totals?: { points: number[]; odds: number[] };
  };
  last_update: string;
};

type OddsData = {
  id: string;
  sport_key: string;
  sport_title: string;
  teams?: string[];
  commence_time: string;
  home_team: string;
  sites: Site[];
  away_team: string;
  odd_price: number;
};

type Props = {
  odds: OddsData[];
};

export default function OddsList({ odds }: Props) {
  const { selectedSport, sortBy } = useOddsContext();
  const [filteredOdds, setFilteredOdds] = useState<OddsData[]>([]);

  useEffect(() => {
    let result = odds;

    if (selectedSport) {
      result = result.filter((odd) => odd.sport_key === selectedSport);
    }

    if (sortBy === 'date') {
      result = _.orderBy(result, ['commence_time'], ['asc']);
    }

    setFilteredOdds(result);
  }, [odds, selectedSport, sortBy]);

  if (!filteredOdds.length) {
    return <p className="text-center text-gray-500 mt-8">Nenhum jogo encontrado.</p>;
  }

  return (
    <div className="grid gap-4 mt-6">
      {filteredOdds.map((odd) => (
        <div key={odd.id} className="bg-white rounded-xl p-4 shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{odd.sport_title}</span>
            <span className="text-xs text-gray-400"> Início:{formatDate(odd.commence_time)}</span>
            
          </div>
          <h2 className="text-lg font-semibold">
            {odd.teams && odd.teams.length >= 2
              ? `${odd.teams[0]} vs ${odd.teams[1]}`
              : odd.home_team
              ? `${odd.home_team} vs ${odd.home_team}`
              : 'Times não definidos'}
          </h2>
          <div className="mt-2">
            {odd.sites?.slice(0, 2).map((site) => (
              <div key={site.site_key} className="text-sm text-gray-700">
                <strong>{site.site_nice}:</strong>{' '}
                {site.odds?.h2h?.join(' | ') || 'Sem odds disponíveis'}
              </div>
            ))}
          </div>
          <div
            key={odd.id}
            className="p-2 bg-green-100 text-green-800 rounded shadow"
          >
            <span className="font-semibold">{odd.home_team}</span>: {odd.odd_price}
            <span className="font-semibold">{odd.away_team}</span>: {odd.odd_price}
          </div>
        </div>
      ))}
    </div>
  );
}
