'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { getBestH2HOutcome } from '@/app/viewmodels/oddsListViewModel'
import { useOddsListState } from '@/state/oddsListState'
import { OddData } from '@/data/Odd'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface OddsListProps {
  odds: OddData[]
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

const OddsList: React.FC<OddsListProps> = ({ odds }) => {
  const { navigateToDetails } = useOddsListState()
  const [items, setItems] = useState<string[]>(odds.map((odd) => odd.id))

  useEffect(() => {
    setItems(odds.map((odd) => odd.id))
  }, [odds])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(String(active.id))
      const newIndex = items.indexOf(String(over.id))
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="space-y-4 mt-3">
          <AnimatePresence>
            {items.map((id) => {
              const odd = odds.find((o) => o.id === id)
              if (!odd) return null

              const {
                bestPriceHome,
                bestOutcomeHome,
                bestBookmakerHome,
                bestPriceAway,
                bestOutcomeAway,
                bestBookmakerAway,
              } = getBestH2HOutcome(odd.bookmakers, odd)

              

              return (
                <SortableItem key={odd.id} id={odd.id}>
                  <motion.li
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
                          Melhor Odd:{' '}
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
                          Melhor Odd:{' '}
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
                </SortableItem>
              )
            })}
          </AnimatePresence>
        </ul>
      </SortableContext>
    </DndContext>
  )
}

export default OddsList
