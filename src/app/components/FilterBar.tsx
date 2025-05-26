'use client';

import { useOddsContext } from '@/app/context/OddsContext';

export default function FilterBar({ sports }: { sports: string[] }) {
  const { selectedSport, setSelectedSport, sortBy, setSortBy } = useOddsContext();

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <select
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Todos os eselectedSportes</option>
        {sports.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Ordenar por</option>
        <option value="teams">Nome dos times</option>
        <option value="commence_time">Data do evento</option>
      </select>
    </div>
  );
}
