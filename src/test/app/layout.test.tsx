import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';
// Mock para a função getSportGroups
// Precisamos mockar o módulo inteiro se getSportGroups não é um default export ou não está em um arquivo separado para ser mockado facilmente.
// No seu caso, getSportGroups vem de '@/features/odds/services/oddsService'.
// Então, vamos mockar esse módulo.
jest.mock('@/features/odds/services/oddsService', () => ({
  getSportGroups: jest.fn(),
}));

// Mock para o OddsProvider
// Embora não seja estritamente necessário mockar o OddsProvider se você apenas quer testar se ele é renderizado,
// pode ser útil para inspecionar as props passadas para ele, caso ele seja mais complexo.
// Por enquanto, vamos deixá-lo como o componente real, mas você pode substituí-lo por um mock se precisar.
jest.mock('@/features/odds/context/OddsContext', () => ({
  OddsProvider: ({ initialSports, children }: { initialSports: any[]; children: React.ReactNode }) => (
    <div data-testid="odds-provider" data-initial-sports={JSON.stringify(initialSports)}>
      {children}
    </div>
  ),
}));

// Importar o mock após a definição do mock
import { getSportGroups } from '@/features/odds/services/oddsService';

describe('RootLayout', () => {
  const MockChildren = () => <div data-testid="mock-children">Conteúdo do filho</div>;

  beforeEach(() => {
    // Limpar o mock antes de cada teste
    (getSportGroups as jest.Mock).mockClear();
    // Default mock para getSportGroups
    (getSportGroups as jest.Mock).mockResolvedValue([]); // Por padrão, retorna um array vazio
  });

  it('should render the header with the correct title and navigation links', async () => {
    render(await RootLayout({ children: <MockChildren /> }));

    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('heading', { name: /ana gaming/i })).toBeInTheDocument(); // H1
    expect(screen.getByRole('link', { name: /ana gaming/i })).toHaveAttribute('href', '/'); // Link do título

    expect(screen.getByRole('navigation')).toBeInTheDocument(); // Nav
    expect(screen.getByRole('link', { name: /logout/i })).toHaveAttribute('href', '/api/auth/signout'); // Link de logout
  });

  it('should render children correctly', async () => {
    render(await RootLayout({ children: <MockChildren /> }));

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do filho')).toBeInTheDocument();
  });

  it('should pass initialSports to OddsProvider when getSportGroups is successful', async () => {
    const mockSports = [
      { key: 'soccer', group: 'Football', title: 'Soccer', has_prematch: true, has_live: false },
      { key: 'basketball', group: 'Basketball', title: 'Basketball', has_prematch: true, has_live: true },
    ];
    (getSportGroups as jest.Mock).mockResolvedValue(mockSports);

    render(await RootLayout({ children: <MockChildren /> }));

    // Como OddsProvider foi mockado para renderizar um data-testid com os props, podemos verificar isso
    await waitFor(() => {
      const oddsProvider = screen.getByTestId('odds-provider');
      expect(oddsProvider).toBeInTheDocument();
      // Verificamos o atributo customizado para garantir que os dados foram passados
      expect(oddsProvider).toHaveAttribute('data-initial-sports', JSON.stringify(mockSports));
    });
  });

  it('should pass an empty array to OddsProvider if getSportGroups fails', async () => {
    (getSportGroups as jest.Mock).mockRejectedValue(new Error('API error'));

    // Renderiza o layout, mesmo com o erro na busca de dados
    render(await RootLayout({ children: <MockChildren /> }));

    // Verificamos se o OddsProvider ainda é renderizado e se recebe um array vazio
    await waitFor(() => {
      const oddsProvider = screen.getByTestId('odds-provider');
      expect(oddsProvider).toBeInTheDocument();
      expect(oddsProvider).toHaveAttribute('data-initial-sports', '[]');
    });

    // Você também pode verificar se o console.error foi chamado
    // const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // render(await RootLayout({ children: <MockChildren /> }));
    // expect(consoleErrorSpy).toHaveBeenCalledWith(
    //   "Failed to load initial sports for OddsProvider:",
    //   expect.any(Error)
    // );
    // consoleErrorSpy.mockRestore(); // Restaura o console.error original
  });
});