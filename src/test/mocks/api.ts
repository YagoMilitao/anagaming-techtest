// src/__tests__/mocks/api.ts

import { Odd, SportGroup } from '@/data/Odd'; // Importe seus tipos de dados reais

// Mock de uma resposta de sucesso para fetchOddsData
export const mockOddsDataSuccess: Odd[] = [
  {
    id: 'b6f6c2f3-1e4e-4f7f-8c0c-7b8e9d0f1a2b',
    sport_key: 'soccer_epl',
    sport_title: 'Premier League',
    commence_time: '2025-06-15T15:00:00Z',
    home_team: 'Manchester United',
    away_team: 'Liverpool',
    bookmakers: [
      {
        key: 'betway',
        title: 'Betway',
        last_update: '2025-06-15T14:50:00Z',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Manchester United', price: 2.10 },
              { name: 'Draw', price: 3.40 },
              { name: 'Liverpool', price: 3.30 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    sport_key: 'basketball_nba',
    sport_title: 'NBA',
    commence_time: '2025-06-16T02:00:00Z',
    home_team: 'Golden State Warriors',
    away_team: 'Boston Celtics',
    bookmakers: [], // Sem bookmakers para simular um cenário
  },
];

// Mock de uma resposta de erro para a API
export const mockApiErrorResponse = {
  message: 'Daily quota exceeded. Please try again tomorrow.',
  error_code: 'OUT_OF_USAGE_CREDITS',
};

// Mock de uma resposta para fetchOddById
export const mockSingleOddSuccess: Odd = {
    id: 'specific-event-123',
    sport_key: 'soccer_club_world_cup',
    sport_title: ' FIFA Club World Cup',
    commence_time: '2025-07-01T18:00:00Z',
    home_team: 'Sao Paulo',
    away_team: 'Liverpool',
    eventId: 'event-123',
    sport: 'soccer',
    status: 'live',
    bookmakers: [
        {
            key: 'paddypower',
            title: 'Paddy Power',
            last_update: '2025-07-01T17:50:00Z',
            markets: [
                {
                    key: 'h2h',
                    outcomes: [
                        { name: 'Sao Paulo', price: 2.50 },
                        { name: 'Draw', price: 3.20 },
                        { name: 'Liverpool', price: 2.80 },
                    ],
                },
            ],
        },
    ],
};

// Mock de uma resposta para fetchSports ou fetchAllSports
export const mockSportsGroupsSuccess: SportGroup[] = [
    { key: 'soccer', group: 'Football', keys: ['soccer_epl', 'soccer_la_liga', 'soccer_bundesliga, soccer_brasileirao'] },
    { key: 'basketball', group: 'Basketball', keys: ['basketball_nba', 'basketball_euroleague', 'basketball_nbb'] },
    { key: 'esports', group: 'Esports', keys: ['esports_csgo', 'esports_lol', 'esports_valorant'] },
];

// Mock para cenários de dados vazios
export const mockEmptyData: any[] = [];