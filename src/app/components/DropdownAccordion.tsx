'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownAccordionProps {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  count?: number;
  status?: 'live' | 'future' | 'finished'; // novo prop para bolinha
}

const statusColors = {
  live: 'bg-red-500',
  future: 'bg-blue-500',
  finished: 'bg-gray-400',
};

export default function DropdownAccordion({ title, defaultOpen = false, children, count, status }: DropdownAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-gray-300 rounded-md shadow-sm">
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 rounded-t-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 font-semibold text-lg">
           {status === 'live' && (
            <motion.span
              className={`w-4 h-4 rounded-full ${statusColors[status]}`}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              aria-label="Indicador de jogos ao vivo pulsante"
            />
            )}
            {(status === 'future' || status === 'finished') && (
            <span
              className={`w-4 h-4 rounded-full ${statusColors[status]}`}
              aria-label={`Indicador de jogos ${status}`}
            />
            )}
            <span>{title}</span>
            {count !== undefined && 
              <span className="text-gray-600">
                ({count})
                </span>
            }
          </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: 'auto', opacity: 1 },
              collapsed: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden px-4 py-2 bg-white rounded-b-md"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
