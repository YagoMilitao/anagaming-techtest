'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Odd = {
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
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
  // Função para encontrar a maior odd (preço) dentre os outcomes
  const getBestOdd = (bookmakers: Odd['bookmakers']) => {
    let bestPrice = 0;
    bookmakers.forEach((bookmaker) => {
      bookmaker.markets.forEach((market) => {
        market.outcomes.forEach((outcome) => {
          if (outcome.price > bestPrice) bestPrice = outcome.price;
        });
      });
    });
    return bestPrice;
  };

  return (
    <ul className="space-y-4 mt-3">
      <AnimatePresence>
        {odds.map((odd) => {
          const bestOdd = getBestOdd(odd.bookmakers);
          return (
            <motion.li
              key={odd.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">
                  {odd.home_team} vs {odd.away_team}
                </h3>
                <span className="text-sm text-gray-500">{formatDateTime(odd.commence_time)}</span>
              </div>
    
              <ul className="flex gap-4 flex-wrap">
                {odd.bookmakers.map((bookmaker) =>
                  bookmaker.markets.map((market, mIndex) =>
                    market.outcomes.map((outcome, oIndex) => {
                      const isBest = outcome.price === bestOdd;
                      return (
                        <li
                          key={`${bookmaker.key}-${mIndex}-${oIndex}`}
                          className={`px-3 py-1 rounded cursor-pointer select-none transition-colors duration-200
                            ${isBest ? 'bg-green-500 text-white font-bold shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                          `}
                          title={`${outcome.name} - Odd: ${outcome.price}`}
                        >
                          {outcome.name}: {outcome.price.toFixed(2)}
                        </li>
                      );
                    })
                  )
                )}
              </ul>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}