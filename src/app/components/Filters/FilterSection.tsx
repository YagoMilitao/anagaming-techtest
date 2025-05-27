'use client';

import { getAvailableSports, getAvailableLeagues } from '@/utils/filterUtils';
import { useFilter } from '../../context/FilterContext';


interface FilterSectionProps {
  data: any[];
}

export default function FilterSection({ data }: FilterSectionProps) {
  const { selectedSport, setSelectedSport, selectedLeague, setSelectedLeague } = useFilter();

  const sports = getAvailableSports(data);
  const leagues = selectedSport ? getAvailableLeagues(data, selectedSport) : [];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div>
        <label className="block text-sm mb-1">Esporte</label>
        <select
          value={selectedSport || ''}
          onChange={(e) => {
            setSelectedSport(e.target.value);
            setSelectedLeague(null);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Campeonato</label>
        <select
          value={selectedLeague || ''}
          onChange={(e) => setSelectedLeague(e.target.value)}
          disabled={!selectedSport}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
