'use client'

import { Sport } from '@/data/Odd'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type OddsContextType = {
  selectedChampionship: string;
  setSelectedChampionship: (championship: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  applySportFilter: (sport: string) => void;
  applyChampionshipFilter: (championship: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  favoriteSports: string[];
  toggleFavoriteSport: (sport: string) => void;
  allSports: { group: string; keys: string[] }[];
  setAllSports: (sports: { group: string; keys: string[] }[]) => void;
};

const OddsContext = createContext<OddsContextType | undefined>(undefined)

export const OddsProvider = ({ children }: { children: ReactNode }) => {
  const [sortBy, setSortBy] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedChampionship, setSelectedChampionship] = useState('')
  const [allSports, setAllSports] = useState<{ group: string, keys: string[] }[]>([])


  const [favoriteSports, setFavoriteSports] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('favoriteSports')
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteSports', JSON.stringify(favoriteSports))
    }
  }, [favoriteSports])

  const toggleFavoriteSport = (sport: string) => {
    setFavoriteSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    )
  }

  const applySportFilter = (sport: string) => {
    setSelectedSport(sport)
    setSelectedChampionship('')
  }

  const applyChampionshipFilter = (championship: string) => {
    setSelectedChampionship(championship)
    setSelectedSport('')
  }

  async function loadSports() {
  try {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.NEXT_PUBLIC_ODDS_API_KEY}`)
    const data = await res.json()

    const grouped: { [group: string]: string[] } = {}
    data.forEach((sport: Sport) => {
      if (!grouped[sport.group]) grouped[sport.group] = []
      grouped[sport.group].push(sport.key)
    })

    const uniqueGroups = Object.entries(grouped).map(([group, keys]) => ({ group, keys }))

    setAllSports(uniqueGroups)
  } catch (error) {
    console.error('Erro ao buscar esportes:', error)
  }
}
useEffect(() => {
  loadSports()
}, [])



  return (
    <OddsContext.Provider
      value={{
        selectedChampionship,
        setSelectedChampionship,
        selectedSport,
        setSelectedSport,
        applySportFilter,
        applyChampionshipFilter,
        sortBy,
        setSortBy,
        favoriteSports,
        toggleFavoriteSport,
        allSports,
        setAllSports
 
      }}
    >
      {children}
    </OddsContext.Provider>
  );
};

export const useOddsContext = () => {
  const context = useContext(OddsContext);
  if (!context) {
    throw new Error('useOddsContext deve ser usado dentro de um OddsProvider');
  }
  return context;
};
