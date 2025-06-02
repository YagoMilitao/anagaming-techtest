export interface Outcome {
  name: string;
  price: number; // Garanta que 'price' seja sempre number aqui, para toFixed(2)
  point?: number;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
  // Removendo 'unknown' para tipagem mais estrita, adicione campos se necessário
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
  // Removendo 'unknown' para tipagem mais estrita
}

// Unificando OddData e OddDetail
export interface Odd {
  // Renomeado para Odd para simplificar, já que é o "detalhe" aqui
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
  eventId?: string; // Opcional, se nem sempre estiver presente
  sport?: string; // Opcional, se for redundante com sport_key/sport_title
  status?: "live" | "future" | "finished" | string; // Opcional
  league_name?: string; // Opcional, se nem sempre presente
}

// Se necessário para outras partes do app
export interface SportGroup {
  group: string;
  keys: string[];
}

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}
