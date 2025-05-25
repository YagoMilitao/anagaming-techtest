'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type OddsListProps = {
  odds: any[];
};

export default function OddsList({ odds }: OddsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {odds.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/apostas/${game.id}`}
            className="block border p-4 rounded shadow hover:bg-gray-50 transition"
          >
            <h2 className="font-bold text-lg">{game.sport_title}</h2>
            <p>{game.teams?.join(' vs ')}</p>
            <p className="text-sm text-gray-600">
              {new Date(game.commence_time).toLocaleString()}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
