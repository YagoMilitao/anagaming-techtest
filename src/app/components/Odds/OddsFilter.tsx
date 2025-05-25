'use client';

import { useOddsContext } from "@/app/context/OddsContext";


const sports = ['soccer', 'basketball', 'tennis', 'mma', 'baseball'];

export default function OddsFilter() {
  const { selectedSport, setSelectedSport } = useOddsContext();

  return (
    <div className="mb-4">
      <label className="mr-2 font-medium">Filtrar por esporte:</label>
      <select
        className="border p-2 rounded"
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
      >
        <option value="">Todos</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
