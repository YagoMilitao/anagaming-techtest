export type Outcome ={
  name: string;
  price: number | string;
  point?: number;
  [key: string]: any;
}

export type Market= {
  key: string;
  outcomes: Outcome[];
  [key: string]: any;
}

export type Bookmaker ={
  key: string;
  title: string;
  markets: Market[];
  [key: string]: any;
}

export type OddData ={
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
  eventId: string;
  sport: string;
  status: 'live' | 'future' | 'finished' | string;
  league_name?: string;
  sport_key: string;
  [key: string]: any;
}

export type SportGroup ={
  group: string;
  keys: string[];
}
