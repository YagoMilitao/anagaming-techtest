import { fetchOddsForSitemap } from '@/app/lib/fetchOdds';
import sitemap from '@/app/sitemap';
import { Odd } from '@/data/Odd';

// Mock da função fetchOddsForSitemap
jest.mock('@/app/lib/fetchOdds', () => ({
  fetchOddsForSitemap: jest.fn(),
}));

describe('sitemap', () => {
  const mockFetchOddsForSitemap = fetchOddsForSitemap as jest.Mock;
  const baseUrl = 'https://anagaming-techtest.vercel.app';

  beforeEach(() => {
    // Limpa o mock antes de cada teste
    mockFetchOddsForSitemap.mockClear();
    // Define um mock padrão para evitar que testes falhem por falta de retorno
    mockFetchOddsForSitemap.mockResolvedValue({ data: [], error: undefined });
  });

  it('should generate a sitemap with static pages when no odds data is available', async () => {
    // A função mockada já retorna [] por padrão, então não precisamos configurar nada específico aqui
    const result = await sitemap();

    expect(mockFetchOddsForSitemap).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { url: baseUrl, lastModified: expect.any(Date), changeFrequency: 'daily', priority: 1.0 },
    ]);
  });

  it('should generate sitemap entries for dynamic sport pages', async () => {
    const mockOdds: Odd[] = [
      { id: '1', sport_key: 'soccer_epl', sport_title: 'Premier League', commence_time: '2025-06-01T10:00:00Z', home_team: 'A', away_team: 'B', bookmakers: [] },
      { id: '2', sport_key: 'basketball_nba', sport_title: 'NBA', commence_time: '2025-06-02T10:00:00Z', home_team: 'C', away_team: 'D', bookmakers: [] },
      { id: '3', sport_key: 'soccer_epl', sport_title: 'Premier League', commence_time: '2025-06-03T10:00:00Z', home_team: 'E', away_team: 'F', bookmakers: [] },
    ];
    mockFetchOddsForSitemap.mockResolvedValue({ data: mockOdds, error: undefined });

    const result = await sitemap();

    // Filtra as páginas estáticas para verificar apenas as dinâmicas de esporte
    const sportPages = result.filter(entry => entry.url.startsWith(`${baseUrl}/sports/`) && entry.priority === 0.9);

    expect(sportPages).toHaveLength(2); // soccer_epl e basketball_nba
    expect(sportPages).toContainEqual({
      url: `${baseUrl}/sports/soccer-epl`,
      lastModified: expect.any(Date),
      changeFrequency: 'daily',
      priority: 0.9,
    });
    expect(sportPages).toContainEqual({
      url: `${baseUrl}/sports/basketball-nba`,
      lastModified: expect.any(Date),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  it('should generate sitemap entries for dynamic event pages', async () => {
    const mockOdds: Odd[] = [
      { id: 'event1', sport_key: 'soccer_epl', sport_title: 'Premier League', commence_time: '2025-06-01T10:00:00Z', home_team: 'A', away_team: 'B', bookmakers: [] },
      { id: 'event2', sport_key: 'basketball_nba', sport_title: 'NBA', commence_time: '2025-06-02T10:00:00Z', home_team: 'C', away_team: 'D', bookmakers: [] },
    ];
    mockFetchOddsForSitemap.mockResolvedValue({ data: mockOdds, error: undefined });

    const result = await sitemap();

    // Filtra as páginas estáticas e de esporte para verificar apenas as dinâmicas de evento
    const eventPages = result.filter(entry => entry.priority === 0.8);

    expect(eventPages).toHaveLength(2);
    expect(eventPages).toContainEqual({
      url: `${baseUrl}/sports/soccer-epl/event1`,
      lastModified: new Date('2025-06-01T10:00:00Z'),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    expect(eventPages).toContainEqual({
      url: `${baseUrl}/sports/basketball-nba/event2`,
      lastModified: new Date('2025-06-02T10:00:00Z'),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  it('should combine static, dynamic sport, and dynamic event pages correctly', async () => {
    const mockOdds: Odd[] = [
      { id: '1', sport_key: 'soccer_epl', sport_title: 'Premier League', commence_time: '2025-06-01T10:00:00Z', home_team: 'A', away_team: 'B', bookmakers: [] },
      { id: '2', sport_key: 'basketball_nba', sport_title: 'NBA', commence_time: '2025-06-02T10:00:00Z', home_team: 'C', away_team: 'D', bookmakers: [] },
    ];
    mockFetchOddsForSitemap.mockResolvedValue({ data: mockOdds, error: undefined });

    const result = await sitemap();

    expect(result).toHaveLength(1 + 2 + 2); // 1 estática + 2 esportes + 2 eventos
    // Verifica a presença de uma página estática
    expect(result).toContainEqual(expect.objectContaining({ url: baseUrl, priority: 1.0 }));
    // Verifica a presença das páginas de esporte
    expect(result).toContainEqual(expect.objectContaining({ url: `${baseUrl}/sports/soccer-epl`, priority: 0.9 }));
    expect(result).toContainEqual(expect.objectContaining({ url: `${baseUrl}/sports/basketball-nba`, priority: 0.9 }));
    // Verifica a presença das páginas de evento
    expect(result).toContainEqual(expect.objectContaining({ url: `${baseUrl}/sports/soccer-epl/1`, priority: 0.8 }));
    expect(result).toContainEqual(expect.objectContaining({ url: `${baseUrl}/sports/basketball-nba/2`, priority: 0.8 }));
  });

  it('should handle errors from fetchOddsForSitemap gracefully and return only static pages', async () => {
    mockFetchOddsForSitemap.mockResolvedValue({ data: undefined, error: 'API_ERROR' });

    const result = await sitemap();

    expect(mockFetchOddsForSitemap).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1); // Apenas a página estática
    expect(result).toEqual([
      { url: baseUrl, lastModified: expect.any(Date), changeFrequency: 'daily', priority: 1.0 },
    ]);
  });
});