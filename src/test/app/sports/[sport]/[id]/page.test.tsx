import { fetchOddById } from '@/app/lib/fetchOdds'; // Função a ser mockada
import { Odd } from '@/data/Odd'; // Tipo de dado Odd
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { notFound } from 'next/navigation'; // Função a ser mockada
import OddDetailsPage, { generateMetadata } from '@/app/sports/[sport]/[id]/page';

// Mocks
jest.mock('@/app/lib/fetchOdds', () => ({
  fetchOddById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(), // Mocka a função notFound
}));

jest.mock('@/features/odds/details/OddsDetailPageContent', () => ({
  __esModule: true,
  default: ({ odd, error }: any) => (
    <div data-testid="odds-detail-page-content" data-odd={JSON.stringify(odd)} data-error={error}>
      Odds Detail Page Content
    </div>
  ),
}));

describe('Odd Details Page', () => {
  const mockFetchOddById = fetchOddById as jest.Mock;
  const mockNotFound = notFound as unknown as jest.Mock;

  const mockOdd: Odd = {
    id: 'event-123',
    sport_key: 'soccer_epl',
    sport_title: 'Premier League',
    commence_time: '2025-06-15T15:00:00Z',
    home_team: 'Manchester United',
    away_team: 'Liverpool',
    bookmakers: [
      { key: 'betway', title: 'Betway', last_update: '2025-06-15T14:50:00Z', markets: [{ key: 'h2h', outcomes: [{ name: 'Manchester United', price: 2.0 }, { name: 'Draw', price: 3.0 }, { name: 'Liverpool', price: 3.5 }] }] },
    ],
  };

  const mockParams = {
    sport: 'soccer-epl',
    id: 'event-123',
  };

  beforeEach(() => {
    mockFetchOddById.mockClear();
    mockNotFound.mockClear();
    // Padrão: fetchOddById retorna um evento de sucesso
    mockFetchOddById.mockResolvedValue({ data: mockOdd, error: undefined });
  });

  // ======================================
  // Testes para generateMetadata
  // ======================================
  describe('generateMetadata', () => {
    it('should generate correct metadata when odd data is available', async () => {
      const metadata = await generateMetadata({ params: mockParams });

      expect(mockFetchOddById).toHaveBeenCalledWith(mockParams.sport, mockParams.id);
      expect(metadata.title).toBe('Manchester United vs Liverpool - Odds de Soccer Epl | Anagaming');
      expect(metadata.description).toContain('Acompanhe as odds ao vivo e informações detalhadas para o jogo de Soccer Epl: Manchester United vs Liverpool.');
      expect(metadata.keywords).toContain('Manchester United odds');
      expect(metadata.keywords).toContain('Liverpool odds');
      expect(metadata.keywords).toContain('Soccer Epl apostas');
      expect(metadata.openGraph?.url).toBe(`https://anagaming-techtest.vercel.app/sports/${mockParams.sport}/${mockParams.id}`);
      expect(metadata.openGraph?.title).toBe('Manchester United vs Liverpool - Odds de Soccer Epl | Anagaming');
    });

    it('should return "Not Found" metadata if odd data is not available', async () => {
      mockFetchOddById.mockResolvedValue({ data: undefined, error: 'NOT_FOUND' });

      const metadata = await generateMetadata({ params: mockParams });

      expect(mockFetchOddById).toHaveBeenCalledWith(mockParams.sport, mockParams.id);
      expect(metadata.title).toBe('Evento Esportivo Não Encontrado | Anagaming');
      expect(metadata.description).toBe('O evento esportivo que você procura não foi encontrado ou está indisponível.');
      expect(metadata.robots).toEqual({ index: false, follow: false });
    });

    it('should return "Not Found" metadata if fetchOddById returns an error', async () => {
      mockFetchOddById.mockResolvedValue({ data: undefined, error: 'API_ERROR' });

      const metadata = await generateMetadata({ params: mockParams });

      expect(mockFetchOddById).toHaveBeenCalledWith(mockParams.sport, mockParams.id);
      expect(metadata.title).toBe('Evento Esportivo Não Encontrado | Anagaming');
      expect(metadata.description).toBe('O evento esportivo que você procura não foi encontrado ou está indisponível.');
    });
  });

  // ======================================
  // Testes para OddDetailsPage (Componente da Página)
  // ======================================
  describe('OddDetailsPage', () => {
    it('should call notFound() if odd data is not found', async () => {
      mockFetchOddById.mockResolvedValue({ data: undefined, error: undefined }); // Data not found, no specific error

      // Como notFound() lança um erro, precisamos encapsular a chamada em uma função
      // e usar expect.toThrow() ou esperar que ela seja chamada.
      // O Jest já faz o mock do notFound, então podemos apenas esperar que seja chamado.
      await OddDetailsPage({ params: mockParams });

      expect(mockFetchOddById).toHaveBeenCalledTimes(1);
      expect(mockNotFound).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('odds-detail-page-content')).not.toBeInTheDocument();
    });

    it('should call notFound() if fetchOddById returns an error', async () => {
      mockFetchOddById.mockResolvedValue({ data: undefined, error: 'API_ERROR' });

      await OddDetailsPage({ params: mockParams });

      expect(mockFetchOddById).toHaveBeenCalledTimes(1);
      expect(mockNotFound).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('odds-detail-page-content')).not.toBeInTheDocument();
    });
  });
});