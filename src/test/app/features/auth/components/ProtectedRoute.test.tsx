import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

// Mockar os módulos necessários
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(), // Mock da função signIn
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(), // Mock do hook usePathname
}));

jest.mock('@/app/components/OddsSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="odds-skeleton">Loading Skeleton</div>, // Mock do OddsSkeleton
}));

describe('ProtectedRoute', () => {
  const mockUseSession = useSession as jest.Mock;
  const mockSignIn = signIn as jest.Mock;
  const mockUsePathname = usePathname as jest.Mock;

  const TEST_CHILDREN = <div data-testid="protected-content">Protected Content</div>;
  const MOCK_PATHNAME = '/protected/page';

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockUseSession.mockClear();
    mockSignIn.mockClear();
    mockUsePathname.mockClear();

    // Define um pathname padrão para os testes
    mockUsePathname.mockReturnValue(MOCK_PATHNAME);
  });

  // ---

  // ======================================
  // Testes de Estado de Carregamento
  // ======================================
  it('should render OddsSkeleton when session status is "loading"', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Verifica se o esqueleto de carregamento é exibido
    expect(screen.getByTestId('odds-skeleton')).toBeInTheDocument();
    // Verifica se o conteúdo protegido NÃO é exibido
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Verifica se signIn NÃO foi chamado
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  // ---

  // ======================================
  // Testes de Autenticação
  // ======================================
  it('should render children when session status is "authenticated"', () => {
    mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: 'authenticated' });

    render(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Verifica se o conteúdo protegido é exibido
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    // Verifica se o esqueleto NÃO é exibido
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
    // Verifica se signIn NÃO foi chamado
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  // ---

  // ======================================
  // Testes de Não Autenticação (Redirecionamento para Login)
  // ======================================
  it('should call signIn with current pathname as callbackUrl when status is "unauthenticated"', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Verifica se signIn foi chamado corretamente
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith(undefined, { callbackUrl: MOCK_PATHNAME });
    // Verifica se o conteúdo protegido NÃO é exibido
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Verifica se o esqueleto NÃO é exibido
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
  });

  it('should render null initially and then call signIn if status changes to "unauthenticated"', () => {
    // Simula o componente renderizando primeiro como 'loading' e depois 'unauthenticated'
    mockUseSession.mockReturnValueOnce({ data: null, status: 'loading' });
    mockUseSession.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

    const { rerender } = render(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Na primeira renderização (loading)
    expect(screen.getByTestId('odds-skeleton')).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();

    // Simula a mudança de estado que dispararia o useEffect
    rerender(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Agora, signIn deve ter sido chamado
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith(undefined, { callbackUrl: MOCK_PATHNAME });
    // E nada deve ser renderizado, pois o retorno final é `null`
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should return null when unauthenticated after signIn is triggered', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<ProtectedRoute>{TEST_CHILDREN}</ProtectedRoute>);

    // Após o signIn ser chamado, o componente deve retornar null
    // (já que ele não renderiza nem o esqueleto nem o conteúdo protegido)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('odds-skeleton')).not.toBeInTheDocument();
    // Verifica que nada é renderizado explicitamente
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument(); // Se o testid não fosse suficiente
  });
});