'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { getBestH2HOutcome } from '@/app/viewmodels/oddsListViewModel';
import { useOddsListState } from '@/state/oddsListState';
import { OddData } from '@/data/Odd';

export interface OddsListProps {
  odds: OddData[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const OddsList: React.FC<OddsListProps> = ({ odds }) => {
  const { navigateToDetails } = useOddsListState();

  return (
    <ul className="space-y-4 mt-3">
      <AnimatePresence>
        {odds.map((odd) => {
          const {
            bestPriceHome,
            bestOutcomeHome,
            bestBookmakerHome,
            bestPriceAway,
            bestOutcomeAway,
            bestBookmakerAway,
          } = getBestH2HOutcome(odd.bookmakers, odd);

          return (
            <motion.li
              key={odd.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onClick={() => navigateToDetails(odd.sport_key, odd.id)}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-500 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg text-gray-800">{odd.sport_title}</h2>
                <p className="text-sm text-gray-500 italic">{odd.league_name}</p>
                <span className="text-sm text-gray-500">{formatDate(odd.commence_time)}</span>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold text-xl text-gray-900">
                  {odd.home_team} <span className="text-gray-400">vs</span> {odd.away_team}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-base text-gray-700">
                    Melhor Odd {odd.home_team}:{' '}
                    <span className="font-semibold text-green-600">
                      {bestOutcomeHome || '-'}
                    </span>{' '}
                    ({bestPriceHome})
                  </div>
                  {bestBookmakerHome && (
                    <div className="text-sm italic text-blue-600">
                      Casa: {bestBookmakerHome}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-base text-gray-700">
                    Melhor Odd {odd.away_team}:{' '}
                    <span className="font-semibold text-green-600">
                      {bestOutcomeAway || '-'}
                    </span>{' '}
                    ({bestPriceAway})
                  </div>
                  {bestBookmakerAway && (
                    <div className="text-sm italic text-blue-600">
                      Casa: {bestBookmakerAway}
                    </div>
                  )}
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
};

export default OddsList;
