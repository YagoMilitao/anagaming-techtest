'use client';

import { motion } from 'framer-motion';

const skeletonItem = {
  pulse: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

export default function OddsSkeleton({ count = 5 }) {
  return (
    <ul className="space-y-4 mt-3">
      {Array.from({ length: count }).map((_, index) => (
        <motion.li
          key={index}
          variants={skeletonItem}
          animate="pulse"
          className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          </div>

          <div className="h-5 w-3/4 bg-gray-300 rounded mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-300 rounded" />
          </div>

          <div className="h-4 w-32 bg-gray-300 rounded" />
        </motion.li>
      ))}
    </ul>
  );
}
