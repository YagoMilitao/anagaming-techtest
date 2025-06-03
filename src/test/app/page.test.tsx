import HomePage from '@/app/page';
import { getServerSession } from 'next-auth/next';
import { fetchOddsData } from '@/app/lib/fetchOdds';
import { Odd } from '@/data/Odd';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// 1. Mock de getServerSession
// Precisamos mockar next-auth/next para controlar a sessão.
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// 2. Mock de fetchOddsData
jest.mock('@/app/lib/fetchOdds', () => ({
  fetchOddsData: jest.fn(),
}));

// 3. Mock de ClientHomePage
// Como queremos testar HomePage e não o ClientHomePage em si,
// mockamos o ClientHomePage para inspecionar as props que ele recebe.
jest.mock('@/app/components/ClientHomePage', () => ({
  __esModule: true,
  default: ({ initialOdds, session, serverRenderedTimestamp, errorMessage }: any) => (
    <div data-testid="client-home-page"
      data-initial-odds={JSON.stringify(initialOdds)}
      data-session={JSON.stringify(session)}
      data-timestamp={serverRenderedTimestamp}
      data-error-message={errorMessage}>
      Client Home Page Content
    </div>
  ),
}));

describe('HomePage', () => {
  const mockGetServerSession = getServerSession as jest.Mock;
  const mockFetchOddsData = fetchOddsData as jest.Mock;

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockGetServerSession.mockClear();
    mockFetchOddsData.mockClear();

    // Configura o mock padrão para getServerSession (sem sessão)
    mockGetServerSession.mockResolvedValue(null);

    // Configura o mock padrão para fetchOddsData (sucesso com dados)
    const defaultOdds: Odd[] = [
      { id: '1', sport_key: 'soccer', sport_title: 'Soccer', commence_time: '2025-06-01T10:00:00Z', home_team: 'Team A', away_team: 'Team B', bookmakers: [] },
    ];
    mockFetchOddsData.mockResolvedValue({ data: defaultOdds, error: undefined });
  });

  // ---

  // ======================================
  // Testes de Renderização e Props
  // ======================================
  it('should render ClientHomePage with default props on successful data fetch and no session', async () => {
    // Renderiza o Server Component assíncrono
    render(await HomePage());

    // Verifica se ClientHomePage foi renderizado
    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toBeInTheDocument();

    // Verifica as props passadas
    expect(clientHomePage).toHaveAttribute('data-initial-odds', JSON.stringify([
      { id: '1', sport_key: 'soccer', sport_title: 'Soccer', commence_time: '2025-06-01T10:00:00Z', home_team: 'Team A', away_team: 'Team B', bookmakers: [] },
    ]));
    expect(clientHomePage).toHaveAttribute('data-session', 'null'); // Sem sessão
    expect(clientHomePage).toHaveAttribute('data-timestamp', expect.any(String)); // Timestamp é gerado dinamicamente
    expect(clientHomePage).toHaveAttribute('data-error-message', 'null'); // Nenhuma mensagem de erro
  });

  it('should pass session data to ClientHomePage when user is authenticated', async () => {
    const mockSession = { user: { name: 'Test User', email: 'test@example.com' }, expires: 'some-date' };
    mockGetServerSession.mockResolvedValue(mockSession);

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-session', JSON.stringify(mockSession));
  });

  it('should pass an empty array to initialOdds if fetchOddsData returns no data', async () => {
    mockFetchOddsData.mockResolvedValue({ data: [], error: undefined });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]');
    expect(clientHomePage).toHaveAttribute('data-error-message', 'Nenhum evento de aposta disponível no momento. Volte mais tarde!');
  });

  // ---

  // ======================================
  // Testes de Tratamento de Erros da API
  // ======================================
  it('should display QUOTA_EXCEEDED message if API quota is exceeded', async () => {
    mockFetchOddsData.mockResolvedValue({ data: undefined, error: 'QUOTA_EXCEEDED' });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]'); // Array vazio em caso de erro
    expect(clientHomePage).toHaveAttribute('data-error-message',
      "Parece que excedemos nossa cota de uso da API de odds. Os dados podem não estar atualizados ou disponíveis no momento. Por favor, tente novamente mais tarde ou entre em contato com o suporte."
    );
  });

  it('should display API_KEY_MISSING message if API key is missing', async () => {
    mockFetchOddsData.mockResolvedValue({ data: undefined, error: 'API_KEY_MISSING' });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]');
    expect(clientHomePage).toHaveAttribute('data-error-message',
      "Erro interno: A chave da API de odds não está configurada corretamente. Favor contatar o administrador."
    );
  });

  it('should display INVALID_DATA_FORMAT message if API returns invalid data', async () => {
    mockFetchOddsData.mockResolvedValue({ data: undefined, error: 'INVALID_DATA_FORMAT' });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]');
    expect(clientHomePage).toHaveAttribute('data-error-message',
      "Ocorreu um problema ao processar os dados das apostas. Tente novamente."
    );
  });

  it('should display generic error message for unknown errors', async () => {
    mockFetchOddsData.mockResolvedValue({ data: undefined, error: 'UNKNOWN_ERROR' });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]');
    expect(clientHomePage).toHaveAttribute('data-error-message',
      "Não foi possível carregar os dados das apostas. Verifique sua conexão com a internet ou tente novamente mais tarde."
    );

    // Teste para um erro não mapeado explicitamente (default case)
    mockFetchOddsData.mockResolvedValue({ data: undefined, error: 'SOME_UNEXPECTED_ERROR' });
    render(await HomePage());
    expect(screen.getByTestId('client-home-page')).toHaveAttribute('data-error-message',
      "Não foi possível carregar os dados das apostas. Verifique sua conexão com a internet ou tente novamente mais tarde."
    );
  });

  it('should not display an error message if initialOdds is empty but there was no explicit API error', async () => {
    // Isso cobre o caso em que a API retorna um array vazio sem um erro.
    mockFetchOddsData.mockResolvedValue({ data: [], error: undefined });

    render(await HomePage());

    const clientHomePage = screen.getByTestId('client-home-page');
    expect(clientHomePage).toHaveAttribute('data-initial-odds', '[]');
    expect(clientHomePage).toHaveAttribute('data-error-message', "Nenhum evento de aposta disponível no momento. Volte mais tarde!");
  });
});