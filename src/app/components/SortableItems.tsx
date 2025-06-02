// src/app/components/SortableItems.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { motion } from "framer-motion"; // Certifique-se de importar motion aqui

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // O estado crucial do dnd-kit
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined, // Use transition do dnd-kit, ou undefined
    zIndex: isDragging ? 999 : 0, // Garante que o item arrastado fique por cima
    cursor: "grab", // Cursor padrão quando não arrastando
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // Adiciona classes Tailwind para feedback visual do drag-and-drop
      className={`
        mb-4 rounded-xl transition-all duration-300 ease-in-out
        ${
          isDragging
            ? "shadow-2xl border-4 border-blue-500 bg-blue-50 cursor-grabbing" // Estilo quando arrastando: borda azul, sombra forte, fundo leve
            : "shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-300" // Estilo normal e hover
        }
      `}
      // Para animação de reordenação com Framer Motion
      layout // Permite que Framer Motion anime as mudanças de layout e posição
    >
      {children}
    </motion.div>
  );
};
