import { useOddsContext } from "@/features/odds/context/OddsContext";

export default function SportsFilter() {
  const { allSports, selectedSport, setSelectedSport, favoriteSports, toggleFavoriteSport } = useOddsContext();

  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-6">
      {allSports.map(({ group }) => {
        const isFavorite = favoriteSports.includes(group);
        const isSelected = selectedSport === group;

        return (
          <div key={group} className="flex items-center gap-1">
            <button
              onClick={() => setSelectedSport(group)}
              className={`px-3 py-1 rounded border ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {group}
            </button>
            <button onClick={() => toggleFavoriteSport(group)} aria-label={`Favoritar esporte ${group}`}>
              {isFavorite ? "⭐" : "☆"}
            </button>
          </div>
        );
      })}

      {selectedSport && (
        <button onClick={() => setSelectedSport("")} className="ml-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">
          Limpar filtro de esporte
        </button>
      )}
    </div>
  );
}
