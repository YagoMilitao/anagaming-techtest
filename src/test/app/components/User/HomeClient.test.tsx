import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react'; // Importa a função a ser mockada
import HomeClient from '@/app/components/User/HomeClient';

// Mocks para os componentes filhos
jest.mock('../LoginButton', () => ({
  __esModule: true,
  default: () => <div data-testid="login-button">Login Button</div>,
}));

jest.mock('../UserPanel', () => ({
  __esModule: true,
  default: ({ session }: any) => <div data-testid="user-panel" data-session={JSON.stringify(session)}>User Panel</div>,
}));

jest.mock('../OddsSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="odds-skeleton">Odds Skeleton</div>,
}));

// Mock para o hook useSession do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('HomeClient', () => {
  const mockUseSession = useSession as jest.Mock;

  beforeEach(() => {
    // Limpa o mock antes de cada teste
    mockUseSession.mockClear();
  });

  it('should render OddsSkeleton when session status is "loading"', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<HomeClient />);

    expect(screen.getByTestId('odds-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-panel')).not.toBeInTheDocument();
  });

  it('should render LoginButton when session status is "unauthenticated"', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<HomeClient />);

    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-panel')).not.toBeInTheDocument();
  });

  it('should render UserPanel and pass session data when status is "authenticated"', () => {
    const mockSession = { user: { name: 'Test User', email: 'test@example.com' }, expires: 'some-date' };
    mockUseSession.mockReturnValue({ data: mockSession, status: 'authenticated' });

    render(<HomeClient />);

    const userPanel = screen.getByTestId('user-panel');
    expect(userPanel).toBeInTheDocument();
    expect(userPanel).toHaveAttribute('data-session', JSON.stringify(mockSession)); // Verifica as props passadas
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
  });

  it('should render LoginButton even if data is null but status is "unauthenticated"', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<HomeClient />);

    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });
});