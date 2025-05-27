'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type Odd = {
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    markets: {
      key: string;
      outcomes: {
        name: string;
        price: number;
      }[];
    }[];
  }[];
};

type OddsListProps = {
  odds: Odd[];
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

  // Encontra a melhor odd entre todas as casas de aposta
  const getBestOddAndBookmaker = (bookmakers: Odd['bookmakers']) => {
    let bestPrice = 0;
    let bestOutcome: string | null = null;
    let bestBookmaker: string | null = null;

    bookmakers.forEach((bookmaker) => {
      bookmaker.markets.forEach((market) => {
        market.outcomes.forEach((outcome) => {
          if (outcome.price > bestPrice) {
            bestPrice = outcome.price;
            bestOutcome = outcome.name;
            bestBookmaker = bookmaker.title;
          }
        });
      });
    });

    return { bestPrice, bestOutcome, bestBookmaker };
  };

  return (
    <ul className="space-y-4 mt-3">
      <AnimatePresence>
        {odds.map((odd) => {
          const { bestPrice, bestOutcome, bestBookmaker } = getBestOddAndBookmaker(odd.bookmakers);
          return (
            <motion.li
              key={odd.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onClick={() => router.push(`/odds/${odd.id}`)}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-500 group"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl text-gray-900">
                  {odd.home_team} <span className="text-gray-400">vs</span> {odd.away_team}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDateTime(odd.commence_time)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-base text-gray-700">
                  Melhor Aposta: <span className="font-semibold text-green-600">{bestOutcome}</span>
                  <br />
                  Odd: <span className="font-semibold">{bestPrice.toFixed(2)}</span>
                  <br />
                  Casa: <span className="italic text-blue-600">{bestBookmaker}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Ver detalhes</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
