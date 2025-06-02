"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { motion } from "framer-motion";

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
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 999 : 0,
    cursor: "grab",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        mb-4 rounded-xl transition-all duration-300 ease-in-out
        ${
          isDragging
            ? "shadow-2xl border-4 border-blue-500 bg-blue-50 cursor-grabbing"
            : "shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-300"
        }
      `}
      layout
    >
      {children}
    </motion.div>
  );
};
