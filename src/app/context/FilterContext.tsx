'use client'

import { createContext, useContext, useState } from 'react'

interface FilterContextProps {
  selectedSport: string | null
  setSelectedSport: (sport: string | null) => void
  selectedLeague: string | null
  setSelectedLeague: (league: string | null) => void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)

  return (
    <FilterContext.Provider
      value={{ selectedSport, setSelectedSport, selectedLeague, setSelectedLeague }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) throw new Error('useFilter must be used within FilterProvider')
  return context
}
