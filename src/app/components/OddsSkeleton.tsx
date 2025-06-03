"use client";

import { motion } from "framer-motion";

interface OddsSkeletonProps {
  count?: number; // Torne opcional e defina um valor padrão se não for passado
}

const itemVariants = {
  pulse: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

export default function OddsSkeleton({ count = 5 }: OddsSkeletonProps) {
  return (
    <ul className="space-y-4 mt-3 p-6 max-w-5xl mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <motion.li
          key={index}
          className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
          variants={itemVariants}
          animate="pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="h-5 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
