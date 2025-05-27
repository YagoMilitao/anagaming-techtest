'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { OddData } from '@/app/sports/[sport]/[id]/page';

type OddsListProps = {
  odds: OddData[];
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OddsList({ odds }: OddsListProps) {
  const router = useRouter();

  const getBestH2HOutcome = (bookmakers: OddData['bookmakers'], odd: OddData) => {
    let bestPriceHome = -1;
    let bestPriceAway = -1;
    let bestOutcomeHome: string | null = null;
    let bestOutcomeAway: string | null = null;
    let bestBookmakerHome: string | null = null;
    let bestBookmakerAway: string | null = null;

    bookmakers.forEach((bookmaker) => {
      const h2hMarket = bookmaker.markets?.find((market) => market.key === 'h2h');
      if (h2hMarket && h2hMarket.outcomes) {
        h2hMarket.outcomes.forEach((outcome) => {
          const price = typeof outcome.price === 'number' ? outcome.price : parseFloat(outcome.price);
          if (outcome.name?.toLowerCase().includes(odd.home_team.toLowerCase())) {
            if (price > bestPriceHome) {
              bestPriceHome = price;
              bestOutcomeHome = outcome.name;
              bestBookmakerHome = bookmaker.title;
            }
          } else if (outcome.name?.toLowerCase().includes(odd.away_team.toLowerCase())) {
            if (price > bestPriceAway) {
              bestPriceAway = price;
              bestOutcomeAway = outcome.name;
              bestBookmakerAway = bookmaker.title;
            }
          }
        });
      }
    });

    return { bestPriceHome: bestPriceHome > 0 ? bestPriceHome.toFixed(2) : '-', bestOutcomeHome, bestBookmakerHome, bestPriceAway: bestPriceAway > 0 ? bestPriceAway.toFixed(2) : '-', bestOutcomeAway, bestBookmakerAway };
  };

  return (
    <ul className="space-y-4 mt-3">
      <AnimatePresence>
        {odds.map((odd) => {
          // console.log("Sport Key:", odd.sport_key, "Event ID:", odd.id);
          const { bestPriceHome, bestOutcomeHome, bestBookmakerHome, bestPriceAway, bestOutcomeAway, bestBookmakerAway } = getBestH2HOutcome(odd.bookmakers, odd);
          return (
            <motion.li
              key={odd.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              // Navegue para a página de detalhes usando a rota dinâmica
              // onClick={() => router.push(`/sports/${odd.sport_key}/${odd.id}`)}
              onClick={() => {
                console.log("Esporte:", odd.sport_key);
    console.log("ID do evento clicado:", odd.id);
    router.push(`/sports/${odd.sport_key}/${odd.id}`);
}}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-500 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg text-gray-800">{odd.sport_title}</h2>
                <p className="text-sm text-gray-500 italic">{odd.league_name}</p>
                <span className="text-sm text-gray-500">{formatDateTime(odd.commence_time)}</span>
              </div>
              <div className="mb-2">
                <h3 className="font-semibold text-xl text-gray-900">
                  {odd.home_team} <span className="text-gray-400">vs</span> {odd.away_team}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-base text-gray-700">
                    Melhor Odd {odd.home_team}: <span className="font-semibold text-green-600">{bestOutcomeHome || '-'}</span> ({bestPriceHome})
                  </div>
                  {bestBookmakerHome && <div className="text-sm italic text-blue-600">Casa: {bestBookmakerHome}</div>}
                </div>
                <div>
                  <div className="text-base text-gray-700">
                    Melhor Odd {odd.away_team}: <span className="font-semibold text-green-600">{bestOutcomeAway || '-'}</span> ({bestPriceAway})
                  </div>
                  {bestBookmakerAway && <div className="text-sm italic text-blue-600">Casa: {bestBookmakerAway}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-medium">Ver detalhes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}