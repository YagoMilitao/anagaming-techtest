export interface Outcome {
  name: string;
  price: number | string;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Odd {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
  league_name?: string;
  status?: string;
  last_update?: string;
}

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_odds: boolean;
}

export interface SportGroup {
  group: string;
  keys: string[];
}
