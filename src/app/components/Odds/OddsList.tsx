// components/OddsList.tsx
'use client';


import { useOddsContext } from "@/app/context/OddsContext";
import { motion } from "framer-motion";

type OddsListProps = {
  odds: any[];
};

export default function OddsList({ odds }: OddsListProps) {
  const { selectedCategory } = useOddsContext();
  const { sport, setSport, sortBy, setSortBy, selectedSport, setSelectedSport } = useOddsContext();

  const filteredOdds = selectedCategory
    ? odds.filter((item) => item.sport_key === selectedCategory)
    : odds;

  if (!filteredOdds || filteredOdds.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma odd encontrada.</p>;
  }

  return (
    <div className="grid gap-4">
      {filteredOdds.map((game, index) => {
        const bookmaker = game.bookmakers?.[0];
        const market = bookmaker?.markets?.[0];
        const outcomes = market?.outcomes;

        return (
          <motion.div
            key={game.id || index}
            className="border p-4 rounded bg-white shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold">{game.sport_title}</h2>
            <p className="text-sm text-gray-600">
              {game.home_team} vs {game.away_team}
            </p>
            {outcomes && outcomes.length >= 2 && (
              <div className="mt-2 space-y-1">
                {outcomes.map((outcome: any, idx: number) => (
                  <p key={idx} className="text-sm">
                    {outcome.name}: <span className="font-medium">{outcome.price}</span>
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
function useOddsFilter(): { selectedCategory: any; } {
  throw new Error("Function not implemented.");
}

