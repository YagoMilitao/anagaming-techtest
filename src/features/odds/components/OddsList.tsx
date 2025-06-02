// src/features/odds/components/OddsList.tsx
"use client"; // Mantenha esta diretiva!

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import OddsListItem from "@/features/odds/components/OddsListItem";
import { Odd } from "@/data/Odd";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "@/app/components/SortableItems";

interface OddsListProps {
  odds: Odd[];
}

const OddsList: React.FC<OddsListProps> = ({ odds }) => {
  const [items, setItems] = useState<Odd[]>(odds);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setItems(odds);
  }, [odds]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over?.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const navigateToDetails = (oddId: string, sportKey: string) => {
    router.push(`/sports/${sportKey}/${oddId}`);
  };

  const oddsMap = useMemo(() => {
    return new Map(items.map((odd) => [odd.id, odd]));
  }, [items]);

  const itemIds = useMemo(() => items.map((odd) => odd.id), [items]);

  if (odds.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4 mb-4">
        Não há eventos disponíveis nesta categoria ou com os filtros selecionados.
      </p>
    );
  }

  // >>> ÚNICA MUDANÇA AQUI: NOVO UL SEM RESPONSIVIDADE DE COLUNAS MULTIPLAS E COM w-full <<<
  if (!hasMounted) {
    return (
      // Agora o ul ocupa 100% da largura e sempre tem 1 coluna
      <ul className="grid grid-cols-1 gap-4 mt-3 w-full">
        {itemIds.map((id) => {
          const odd = oddsMap.get(id);
          if (!odd) return null;
          return (
            <li key={odd.id} className="mb-4 rounded-xl shadow-md">
              <OddsListItem odd={odd} onSelectOdd={navigateToDetails} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <ul className="grid grid-cols-1 gap-4 mt-3 w-full">
          <AnimatePresence initial={false}>
            {itemIds.map((id) => {
              const odd = oddsMap.get(id);
              if (!odd) return null;
              return (
                <SortableItem key={odd.id} id={odd.id}>
                  <OddsListItem odd={odd} onSelectOdd={navigateToDetails} />
                </SortableItem>
              );
            })}
          </AnimatePresence>
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default OddsList;
