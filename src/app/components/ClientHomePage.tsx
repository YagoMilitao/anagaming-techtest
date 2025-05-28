'use client'

import React, { useEffect, useState } from "react"
import { fetchOddsData } from "../lib/fetchOdds"
import { useOddsContext } from "../context/OddsContext"
import UserPanel from "./UserPanel"
import DropdownAccordion from "./DropdownAccordion"
import SportsFilter from "./Filters/SportsFilter"
import { Session } from "next-auth"
import OddsSkeleton from "./OddsSkeleton"
import { OddData } from "@/data/Odd"
import OddsList from "./Odds/OddsList"

export default function ClientHomePage({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [odds, setOdds] = useState<OddData[]>([]) 

  const {
    selectedSport,
    favoriteSports,
    toggleFavoriteSport,
    allSports,
  } = useOddsContext()

  useEffect(() => {
    async function loadOdds() {
      try {
        const fetchedOdds = await fetchOddsData()
        if (Array.isArray(fetchedOdds)) {
          setOdds(fetchedOdds)
        } else {
          console.error("fetchOddsData retornou dados em formato inesperado:", fetchedOdds)
          setOdds([])
        }
      } catch (error) {
        console.error("Erro ao carregar odds:", error)
        setOdds([])
      } finally {
        setLoading(false)
      }
    }
    loadOdds()
  }, [])
  
  if (loading) {
    return <OddsSkeleton />
  }


  const selectedGroup = allSports.find((g) => g.group === selectedSport)
  const selectedKeys: string[] = selectedGroup ? selectedGroup.keys : []

  const filteredOdds = selectedKeys.length > 0
    ? odds.filter((odd) => selectedKeys.includes(odd.sport_key))
    : odds

  const now = Date.now()

  const liveGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime()
    if (isNaN(start)) {
      console.warn(`LiveGames: Data de início inválida para o evento ${odd.id || 'desconhecido'}: ${odd.commence_time}`)
      return false
    }
    return start <= now && now <= start + 3 * 60 * 60 * 1000
  })

  const futureGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime()
    if (isNaN(start)) {
      console.warn(`FutureGames: Data de início inválida para o evento ${odd.id || 'desconhecido'}: ${odd.commence_time}`)
      return false
    }
    return start > now
  })

  const finishedGames = filteredOdds.filter((odd) => {
    const start = new Date(odd.commence_time).getTime()
    if (isNaN(start)) {
      console.warn(`FinishedGames: Data de início inválida para o evento ${odd.id || 'desconhecido'}: ${odd.commence_time}`)
      return false
    }
    return start + 3 * 60 * 60 * 1000 < now 
  })
  
  function sortByCommenceTimeAsc(games: OddData[]): OddData[] {
    if (!Array.isArray(games)) {
      console.warn("sortByCommenceTimeAsc: 'games' não é um array. Retornando array vazio.")
      return []
    }
    return [...games].sort((a, b) => {
      const timeA = new Date(a.commence_time).getTime()
      const timeB = new Date(b.commence_time).getTime()
      if (isNaN(timeA) && isNaN(timeB)) return 0
      if (isNaN(timeA)) return 1
      if (isNaN(timeB)) return -1
      return timeA - timeB
    })
  }

  function sortByCommenceTimeDesc(games: OddData[]): OddData[] {
    if (!Array.isArray(games)) {
      console.warn("sortByCommenceTimeDesc: 'games' não é um array. Retornando array vazio.")
      return []
    }
    return [...games].sort((a, b) => {
      const timeA = new Date(a.commence_time).getTime()
      const timeB = new Date(b.commence_time).getTime()
      if (isNaN(timeA) && isNaN(timeB)) return 0
      if (isNaN(timeA)) return 1
      if (isNaN(timeB)) return -1
      return timeB - timeA
    })
  }
  
  const sortedLiveGames = sortByCommenceTimeAsc(liveGames)
  const sortedFutureGames = sortByCommenceTimeAsc(futureGames)
  const sortedFinishedGames = sortByCommenceTimeDesc(finishedGames)

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <UserPanel session={session} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apostas ao Vivo</h1>
        {favoriteSports.length > 0 && (
          <button
            onClick={() => {
              favoriteSports.forEach((sport) => toggleFavoriteSport(sport))
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            aria-label="Limpar categorias favoritas"
          >
            Limpar categorias favoritas
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <SportsFilter />
      </div>
      <DropdownAccordion
        title={
          <div className="flex items-center gap-2">
            <span>Jogos Ao Vivo</span>
          </div>
        }
        defaultOpen
        count={sortedLiveGames.length}
        status="live"
      >
        <OddsList odds={sortedLiveGames} />
      </DropdownAccordion>
      <DropdownAccordion
        title={
          <div className="flex items-center gap-2">
            <span>Jogos Futuros</span>
          </div>
        }
        defaultOpen
        count={sortedFutureGames.length}
        status="future"
      >
        <OddsList odds={sortedFutureGames} />
      </DropdownAccordion>
      <DropdownAccordion
        title={
          <div className="flex items-center gap-2">
            <span>Jogos Encerrados</span>
          </div>
        }
        count={sortedFinishedGames.length}
        status="finished"
      >
        <OddsList odds={sortedFinishedGames} />
      </DropdownAccordion>
    </main>
  )
}