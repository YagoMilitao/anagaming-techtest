export interface Outcome {
  name: string
  price: number | string
  point?: number
  [key: string]: unknown 
}

export interface Market {
  key: string
  outcomes: Outcome[]
  [key: string]: unknown 
}

export interface Bookmaker {
  key: string
  title: string
  markets: Market[]
  [key: string]: unknown
}


export type OddData ={
  id: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
  eventId: string
  sport: string
  status: 'live' | 'future' | 'finished' | string
  league_name?: string
  sport_key: string
  [key: string]: unknown
}

export type SportGroup ={
  group: string
  keys: string[]
}


export type OddDetail = {
  id: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  league_name: string
  bookmakers: {
    key: string
    markets: {
      outcomes: {
        name: string
        price: number
      }[]
    }[]
  }[]
}

export type Sport ={
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}