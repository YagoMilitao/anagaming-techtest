import { getBestOdds, BestOutcomeDetail } from "@/app/lib/getBestOdds";
import { Bookmaker, Odd } from "@/data/Odd"; // Importe os tipos reais do seu projeto
import { getBestTeamOdds } from "@/utils/oddsCalculation";

// Mock da função getBestOdds para que getBestTeamOdds possa ser testada isoladamente
jest.mock("../../utils/oddsCalculation", () => ({
  ...jest.requireActual("../../utils/oddsCalculation"), // Importa todas as outras funções reais do módulo
  getBestOdds: jest.fn(), // Sobrescreve apenas getBestOdds com um mock
}));

describe("oddsCalculations", () => {
  // Converte a função mockada de volta para um tipo Jest.Mock para facilitar o uso
  const mockGetBestOdds = getBestOdds as jest.Mock;

  // Um mock de Odd para usar nos testes de getBestTeamOdds
  const mockOdd: Odd = {
    id: "test_event_123",
    sport_key: "soccer",
    sport_title: "Soccer",
    commence_time: "2025-06-02T20:00:00Z",
    home_team: "Flamengo",
    away_team: "Vasco",
    bookmakers: [], // Não importa para getBestTeamOdds, pois getBestOdds é mockada
  };

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockGetBestOdds.mockClear();
  });

  // ======================================
  // Testes para getBestOdds
  // ======================================
  describe("getBestOdds", () => {
    // Nota: Para os testes de getBestOdds, como ela é a função "real" que estamos importando
    // e testando diretamente neste 'describe' (já que a mockamos para o outro 'describe'),
    // precisamos chamar a implementação original do getBestOdds.
    // Uma forma de fazer isso é importar a versão real com um alias ou simplesmente
    // não ter o mock globalmente para este escopo.
    // Como estamos usando um mock global, para testar a implementação REAL de getBestOdds
    // dentro deste bloco, você precisaria de uma estratégia diferente (ex: mockar e então
    // restaurar a implementação original, ou ter o mock mais específico para o describe de getBestTeamOdds).

    // Para simplificar e manter o exemplo limpo, vamos considerar que o mock global do `jest.mock('../oddsCalculations', ...)`
    // é para a função `getBestOdds` no arquivo `oddsCalculations.ts`
    // e que estamos testando a implementação *real* da função `getBestOdds` no seu próprio arquivo.
    // O mock do `jest.mock` acima afeta *apenas* a importação de `getBestOdds` nos outros testes (como `getBestTeamOdds`).
    // A função `getBestOdds` que você importa na primeira linha do arquivo de teste é a *real*.

    it("should return an empty array if no bookmakers are provided", () => {
      const bookmakers: Bookmaker[] = [];
      const result = getBestOdds(bookmakers); // Chamando a função real
      expect(result).toEqual([]);
    });

    it("should return an empty array if no h2h markets are found", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bookie1",
          title: "Bookie 1",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "totals", // Apenas um mercado que não é h2h
              outcomes: [
                { name: "Over", price: 1.8 },
                { name: "Under", price: 2.0 },
              ],
            },
          ],
        },
      ];
      const result = getBestOdds(bookmakers);
      expect(result).toEqual([]);
    });

    it("should find the best odds for each distinct outcome across multiple bookmakers", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bet365",
          title: "Bet365",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Team A", price: 2.0 },
                { name: "Draw", price: 3.2 },
                { name: "Team B", price: 3.5 },
              ],
            },
          ],
        },
        {
          key: "paddypower",
          title: "Paddy Power",
          last_update: "2025-06-01T10:05:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Team A", price: 2.1 }, // Melhor para Team A
                { name: "Draw", price: 3.1 },
                { name: "Team B", price: 3.4 },
              ],
            },
          ],
        },
        {
          key: "williamhill",
          title: "William Hill",
          last_update: "2025-06-01T10:10:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Team A", price: 1.95 },
                { name: "Draw", price: 3.3 }, // Melhor para Draw
                { name: "Team B", price: 3.6 }, // Melhor para Team B
              ],
            },
          ],
        },
      ];

      const expected: BestOutcomeDetail[] = [
        { name: "Team A", price: 2.1, bookmakerName: "Paddy Power" },
        { name: "Draw", price: 3.3, bookmakerName: "William Hill" },
        { name: "Team B", price: 3.6, bookmakerName: "William Hill" },
      ];

      const result = getBestOdds(bookmakers);

      // Ordena os resultados para garantir que a comparação seja consistente
      const sortedResult = result.sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name));
      const sortedExpected = expected.sort((a, b) => a.name.localeCompare(b.name));

      expect(sortedResult).toEqual(sortedExpected);
    });

    it("should handle outcomes with the same name from different bookmakers correctly", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bookieA",
          title: "Bookie A",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Home", price: 1.5 },
                { name: "Away", price: 2.5 },
              ],
            },
          ],
        },
        {
          key: "bookieB",
          title: "Bookie B",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Home", price: 1.6 }, // Melhor Home odd
                { name: "Away", price: 2.4 },
              ],
            },
          ],
        },
      ];

      const expected: BestOutcomeDetail[] = [
        { name: "Home", price: 1.6, bookmakerName: "Bookie B" },
        { name: "Away", price: 2.5, bookmakerName: "Bookie A" },
      ];

      const result = getBestOdds(bookmakers);
      const sortedResult = result.sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name));
      const sortedExpected = expected.sort((a, b) => a.name.localeCompare(b.name));

      expect(sortedResult).toEqual(sortedExpected);
    });

    it("should only consider h2h markets and ignore others", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bookie1",
          title: "Bookie 1",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [{ name: "A", price: 1.5 }],
            },
            {
              key: "spreads", // Deve ser ignorado
              outcomes: [{ name: "A (-1)", price: 1.8 }],
            },
          ],
        },
      ];
      const expected: BestOutcomeDetail[] = [{ name: "A", price: 1.5, bookmakerName: "Bookie 1" }];
      const result = getBestOdds(bookmakers);
      expect(result).toEqual(expected);
    });

    it("should handle scenarios where some outcomes are missing in some bookmakers (but present in others)", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bookie1",
          title: "Bookie 1",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Team X", price: 2.0 },
                { name: "Draw", price: 3.0 },
              ],
            },
          ],
        },
        {
          key: "bookie2",
          title: "Bookie 2",
          last_update: "2025-06-01T10:05:00Z",
          markets: [
            {
              key: "h2h",
              outcomes: [
                { name: "Team X", price: 2.1 }, // Melhor Team X
                { name: "Team Y", price: 4.0 }, // Apenas Team Y aqui
              ],
            },
          ],
        },
      ];
      const expected: BestOutcomeDetail[] = [
        { name: "Team X", price: 2.1, bookmakerName: "Bookie 2" },
        { name: "Draw", price: 3.0, bookmakerName: "Bookie 1" },
        { name: "Team Y", price: 4.0, bookmakerName: "Bookie 2" },
      ];

      const result = getBestOdds(bookmakers);
      const sortedResult = result.sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name));
      const sortedExpected = expected.sort((a, b) => a.name.localeCompare(b.name));

      expect(sortedResult).toEqual(sortedExpected);
    });

    it("should correctly identify the bookmaker even if parentBookmaker lookup is complex", () => {
      const bookmakers: Bookmaker[] = [
        {
          key: "bookieComplex",
          title: "Complex Bookie",
          last_update: "2025-06-01T10:00:00Z",
          markets: [
            { key: "spreads", outcomes: [] },
            { key: "h2h", outcomes: [{ name: "Home", price: 1.8 }] },
          ],
        },
      ];

      const result = getBestOdds(bookmakers);
      expect(result).toEqual([{ name: "Home", price: 1.8, bookmakerName: "Complex Bookie" }]);
    });
  });

  // ======================================
  // Testes para getBestTeamOdds
  // ======================================
  describe("getBestTeamOdds", () => {
    it("should return nulls if getBestOdds returns an empty array", () => {
      mockGetBestOdds.mockReturnValue([]); // getBestOdds retorna vazio

      const bookmakers: Bookmaker[] = []; // O input não importa, pois getBestOdds é mockada
      const result = getBestTeamOdds(bookmakers, mockOdd);

      expect(mockGetBestOdds).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        bestPriceHome: null,
        bestOutcomeHome: null,
        bestBookmakerHome: null,
        bestPriceAway: null,
        bestOutcomeAway: null,
        bestBookmakerAway: null,
        bestPriceDraw: null,
        bestBookmakerDraw: null,
      });
    });

    it("should correctly identify and return best odds for home and away teams when draw is not present", () => {
      const mockBestOutcomes: BestOutcomeDetail[] = [
        { name: "Flamengo", price: 2.1, bookmakerName: "Bookie A" },
        { name: "Vasco", price: 3.5, bookmakerName: "Bookie B" },
      ];
      mockGetBestOdds.mockReturnValue(mockBestOutcomes);

      const bookmakers: Bookmaker[] = []; // O input não importa
      const result = getBestTeamOdds(bookmakers, mockOdd);

      expect(mockGetBestOdds).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        bestPriceHome: 2.1,
        bestOutcomeHome: "Flamengo",
        bestBookmakerHome: "Bookie A",
        bestPriceAway: 3.5,
        bestOutcomeAway: "Vasco",
        bestBookmakerAway: "Bookie B",
        bestPriceDraw: null,
        bestBookmakerDraw: null,
      });
    });

    it("should correctly identify and return best odds for home, away, and draw", () => {
      const mockBestOutcomes: BestOutcomeDetail[] = [
        { name: "Flamengo", price: 1.8, bookmakerName: "BetX" },
        { name: "Vasco", price: 4.2, bookmakerName: "SportsBook" },
        { name: "Draw", price: 3.0, bookmakerName: "Paddles" },
      ];
      mockGetBestOdds.mockReturnValue(mockBestOutcomes);

      const bookmakers: Bookmaker[] = [];
      const result = getBestTeamOdds(bookmakers, mockOdd);

      expect(mockGetBestOdds).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        bestPriceHome: 1.8,
        bestOutcomeHome: "Flamengo",
        bestBookmakerHome: "BetX",
        bestPriceAway: 4.2,
        bestOutcomeAway: "Vasco",
        bestBookmakerAway: "SportsBook",
        bestPriceDraw: 3.0,
        bestBookmakerDraw: "Paddles",
      });
    });

    it("should handle cases where only some outcomes are found", () => {
      const mockBestOutcomes: BestOutcomeDetail[] = [{ name: "Flamengo", price: 1.9, bookmakerName: "OnlyHome" }];
      mockGetBestOdds.mockReturnValue(mockBestOutcomes);

      const bookmakers: Bookmaker[] = [];
      const result = getBestTeamOdds(bookmakers, mockOdd);

      expect(mockGetBestOdds).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        bestPriceHome: 1.9,
        bestOutcomeHome: "Flamengo",
        bestBookmakerHome: "OnlyHome",
        bestPriceAway: null,
        bestOutcomeAway: null,
        bestBookmakerAway: null,
        bestPriceDraw: null,
        bestBookmakerDraw: null,
      });
    });

    it("should handle different home/away team names correctly", () => {
      const customOdd: Odd = {
        ...mockOdd,
        home_team: "Golden State Warriors",
        away_team: "Boston Celtics",
      };
      const mockBestOutcomes: BestOutcomeDetail[] = [
        { name: "Golden State Warriors", price: 1.5, bookmakerName: "A" },
        { name: "Boston Celtics", price: 2.5, bookmakerName: "B" },
      ];
      mockGetBestOdds.mockReturnValue(mockBestOutcomes);

      const result = getBestTeamOdds([], customOdd);

      expect(result.bestOutcomeHome).toBe("Golden State Warriors");
      expect(result.bestPriceHome).toBe(1.5);
      expect(result.bestOutcomeAway).toBe("Boston Celtics");
      expect(result.bestPriceAway).toBe(2.5);
    });
  });
});
