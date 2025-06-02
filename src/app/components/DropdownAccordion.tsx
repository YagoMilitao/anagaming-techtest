// src/app/components/DropdownAccordion.tsx
"use client"; // Provavelmente precisa desta diretiva

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Para ícones de acordeão
import { motion, AnimatePresence } from "framer-motion";

interface DropdownAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number; // Para mostrar quantos itens estão na seção
  status?: "live" | "future" | "finished"; // Para talvez mudar cores/ícones
}

const DropdownAccordion: React.FC<DropdownAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  count,
  status,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Cores baseadas no status
  const headerBgClass =
    status === "live"
      ? "bg-gradient-to-r from-blue-600 to-blue-800"
      : status === "future"
        ? "bg-gradient-to-r from-green-600 to-green-800"
        : "bg-gradient-to-r from-gray-600 to-gray-800";

  return (
    <div className="rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
      <button
        className={`flex items-center justify-between w-full p-4 text-white font-bold text-left transition-all duration-300 ease-in-out ${headerBgClass} hover:opacity-90`}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          {title}
          {count !== undefined && (
            <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold">{count}</span>
          )}
        </span>
        {isOpen ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border-t border-gray-200">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownAccordion;
