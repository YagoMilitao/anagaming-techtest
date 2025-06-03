import { renderHook, act } from '@testing-library/react';

import { useOddsContext } from '@/features/odds/context/OddsContext'; // Contexto a ser mockado
import * as oddsProcessing from '@/utils/oddsProcessing'; // Funções de processamento a serem mockadas
import { Odd } from '@/data/Odd'; // Tipo Odd
import { useOddsHomeViewModel } from '@/features/hooks/useOddsHomeViewModel';

// Mocks
jest.mock('@/features/odds/context/OddsContext', () => ({
  useOddsContext: jest.fn(),
}));

jest.mock('@/utils/oddsProcessing', () => ({
  filterOddsBySportKeys: jest.fn(),
  categorizeOddsByTime: jest.fn(),
  sortOddsByCommenceTimeAsc: jest.fn(),
  sortOddsByCommenceTimeDesc: jest.fn(),
}));

describe('useOddsHomeViewModel', () => {
  const mockUseOddsContext = useOddsContext as jest.Mock;
  const mockFilterOddsBySportKeys = oddsProcessing.filterOddsBySportKeys as jest.Mock;
  const mockCategorizeOddsByTime = oddsProcessing.categorizeOddsByTime as jest.Mock;
  const mockSortOddsByCommenceTimeAsc = oddsProcessing.sortOddsByCommenceTimeAsc as jest.Mock;
  const mockSortOddsByCommenceTimeDesc = oddsProcessing.sortOddsByCommenceTimeDesc as jest.Mock;

  const initialOdds: Odd[] = [
    { id: '1', sport_key: 'soccer', sport_title: 'Soccer', commence_time: '2025-06-02T22:00:00Z', home_team: 'Team A', away_team: 'Team B', bookmakers: [] },
    { id: '2', sport_key: 'basketball', sport_title: 'Basketball', commence_time: '2025-06-02T18:00:00Z', home_team: 'Team C', away_team: 'Team D', bookmakers: [] },
    { id: '3', sport_key: 'soccer', sport_title: 'Soccer', commence_time: '2025-06-01T10:00:00Z', home_team: 'Team E', away_team: 'Team F', bookmakers: [] }, // Finished
  ];

  const serverRenderedTimestamp = 1717366074000; // Monday, June 2, 2025 9:47:54 PM GMT-03:00

  const mockContextValues = {
    selectedSport: 'all',
    favoriteSports: ['soccer'],
    toggleFavoriteSport: jest.fn(),
    allSports: [
      { group: 'all', keys: ['soccer', 'basketball'] },
      { group: 'soccer', keys: ['soccer'] },
      { group: 'basketball', keys: ['basketball'] },
    ],
  };

  // Mock de dados retornados pelas funções de processamento
  const mockFilteredOdds: Odd[] = [{ id: '1', sport_key: 'soccer', sport_title: 'Soccer', commence_time: '2025-06-02T22:00:00Z', home_team: 'Team A', away_team: 'Team B', bookmakers: [] }];
  const mockCategorizedOdds = {
    liveGames: [{ ...mockFilteredOdds[0], id: 'live-1' }],
    futureGames: [{ ...mockFilteredOdds[0], id: 'future-1' }],
    finishedGames: [{ ...mockFilteredOdds[0], id: 'finished-1' }],
  };

  beforeEach(() => {
    jest.useFakeTimers(); // Habilita o controle do tempo
    mockUseOddsContext.mockClear();
    mockFilterOddsBySportKeys.mockClear();
    mockCategorizeOddsByTime.mockClear();
    mockSortOddsByCommenceTimeAsc.mockClear();
    mockSortOddsByCommenceTimeDesc.mockClear();

    // Configura o mock do contexto
    mockUseOddsContext.mockReturnValue(mockContextValues);

    // Configura os mocks das funções de processamento para retornar valores previsíveis
    mockFilterOddsBySportKeys.mockReturnValue(mockFilteredOdds);
    mockCategorizeOddsByTime.mockReturnValue(mockCategorizedOdds);
    // As funções de ordenação geralmente retornam o próprio array de entrada ordenado
    mockSortOddsByCommenceTimeAsc.mockImplementation((arr) => [...arr].sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()));
    mockSortOddsByCommenceTimeDesc.mockImplementation((arr) => [...arr].sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime()));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Garante que todos os timers pendentes são executados
    jest.useRealTimers(); // Restaura os timers reais
  });

    it('should call odds processing functions with correct arguments', () => {
    renderHook(() => useOddsHomeViewModel({ initialOdds, serverRenderedTimestamp }));

    // filterOddsBySportKeys deve ser chamado com as odds iniciais e as chaves de esporte do contexto
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledTimes(1);
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledWith(initialOdds, mockContextValues.allSports[0].keys); // 'all' sports keys

    // categorizeOddsByTime deve ser chamado com as odds filtradas e o tempo atual
    expect(mockCategorizeOddsByTime).toHaveBeenCalledTimes(1);
    expect(mockCategorizeOddsByTime).toHaveBeenCalledWith(mockFilteredOdds, serverRenderedTimestamp);

    // As funções de ordenação devem ser chamadas com os arrays categorizados
    expect(mockSortOddsByCommenceTimeAsc).toHaveBeenCalledTimes(2); // Para liveGames e futureGames
    expect(mockSortOddsByCommenceTimeAsc).toHaveBeenCalledWith(mockCategorizedOdds.liveGames);
    expect(mockSortOddsByCommenceTimeAsc).toHaveBeenCalledWith(mockCategorizedOdds.futureGames);

    expect(mockSortOddsByCommenceTimeDesc).toHaveBeenCalledTimes(1); // Para finishedGames
    expect(mockSortOddsByCommenceTimeDesc).toHaveBeenCalledWith(mockCategorizedOdds.finishedGames);
  });

  it('should expose processed odds and context values', () => {
    const { result } = renderHook(() => useOddsHomeViewModel({ initialOdds, serverRenderedTimestamp }));

    // Verifica se as odds processadas são retornadas
    expect(result.current.liveGames).toEqual(expect.arrayContaining(mockCategorizedOdds.liveGames));
    expect(result.current.futureGames).toEqual(expect.arrayContaining(mockCategorizedOdds.futureGames));
    expect(result.current.finishedGames).toEqual(expect.arrayContaining(mockCategorizedOdds.finishedGames));

    // Verifica se os valores do contexto são expostos
    expect(result.current.selectedSport).toBe(mockContextValues.selectedSport);
    expect(result.current.allSports).toEqual(mockContextValues.allSports);
    expect(result.current.favoriteSports).toEqual(mockContextValues.favoriteSports);
    expect(result.current.toggleFavoriteSport).toBe(mockContextValues.toggleFavoriteSport);
  });

  it('should re-filter and re-categorize when selectedSport changes', () => {
    const { rerender, result } = renderHook(({ initialOdds, serverRenderedTimestamp }) =>
      useOddsHomeViewModel({ initialOdds, serverRenderedTimestamp }),
      { initialProps: { initialOdds, serverRenderedTimestamp } }
    );

    // Primeira renderização (status 'all')
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledWith(initialOdds, mockContextValues.allSports[0].keys);
    mockFilterOddsBySportKeys.mockClear(); // Limpa para a próxima verificação

    // Simula a mudança do selectedSport no contexto
    mockUseOddsContext.mockReturnValue({ ...mockContextValues, selectedSport: 'soccer' });
    rerender({ initialOdds, serverRenderedTimestamp });

    // filterOddsBySportKeys deve ser chamado novamente com as novas chaves
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledTimes(1);
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledWith(initialOdds, mockContextValues.allSports[1].keys); // 'soccer' keys
  });

  it('should reset odds to initialOdds when initialOdds prop changes', () => {
    const { rerender, result } = renderHook(({ initialOdds, serverRenderedTimestamp }) =>
      useOddsHomeViewModel({ initialOdds, serverRenderedTimestamp }),
      { initialProps: { initialOdds, serverRenderedTimestamp } }
    );

    // Initial check
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledWith(initialOdds, expect.any(Array));
    mockFilterOddsBySportKeys.mockClear();

    const newInitialOdds: Odd[] = [{ id: '4', sport_key: 'rugby', sport_title: 'Rugby', commence_time: '2025-06-03T10:00:00Z', home_team: 'Team G', away_team: 'Team H', bookmakers: [] }];

    rerender({ initialOdds: newInitialOdds, serverRenderedTimestamp });

    // The setOdds in useEffect should be triggered, which in turn causes recalculation
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledTimes(1);
    expect(mockFilterOddsBySportKeys).toHaveBeenCalledWith(newInitialOdds, expect.any(Array));
  });
});