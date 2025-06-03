
import { authOptions } from "@/app/lib/authOptions";
import GitHubProvider from "next-auth/providers/github"; // Importe o provedor real

// Mock da função GitHubProvider, pois não precisamos testar o provedor em si,
// mas sim que ele foi configurado com os IDs e secrets corretos.
// Ou, se você realmente quiser que ele seja o real para inspecionar, pode remover este mock.
jest.mock("next-auth/providers/github", () => ({
  __esModule: true, // Necessário para mocks de módulos ES6
  default: jest.fn((options) => ({ id: 'github', name: 'GitHub', ...options })), // Retorna um objeto mockado
}));

describe('authOptions', () => {
  // Configura variáveis de ambiente mockadas para os testes
  beforeEach(() => {
    process.env.GITHUB_ID = 'mock_github_id';
    process.env.GITHUB_SECRET = 'mock_github_secret';
    process.env.NEXTAUTH_SECRET = 'mock_nextauth_secret';
    // Limpa o mock do GitHubProvider
    (GitHubProvider as jest.Mock).mockClear();
  });

  // Limpa as variáveis de ambiente após todos os testes para não afetar outros
  afterAll(() => {
    delete process.env.GITHUB_ID;
    delete process.env.GITHUB_SECRET;
    delete process.env.NEXTAUTH_SECRET;
  });

  // Teste de configuração básica
  it('should have the correct structure for NextAuthOptions', () => {
    expect(authOptions).toBeDefined();
    expect(authOptions.providers).toBeInstanceOf(Array);
    expect(authOptions.providers).toHaveLength(1); // Espera-se 1 provedor
    expect(authOptions.secret).toBe('mock_nextauth_secret');
    expect(authOptions.callbacks).toBeDefined();
    expect(authOptions.pages).toEqual({ signIn: "/auth/signin" });
  });

  // Teste que o GitHubProvider é chamado com as credenciais corretas
  it('should configure GitHubProvider with correct client ID and secret', () => {
    // Acessa o provedor configurado no authOptions
    // Precisa de um cast para 'any' porque o TypeScript pode não saber os detalhes do provedor mockado.
    const githubProviderConfig = (authOptions.providers[0] as any);

    // Verifica se o GitHubProvider foi chamado com as opções corretas
    expect(GitHubProvider).toHaveBeenCalledTimes(1);
    expect(GitHubProvider).toHaveBeenCalledWith({
      clientId: 'mock_github_id',
      clientSecret: 'mock_github_secret',
    });

    // Você pode testar outras propriedades do provedor se elas forem importantes para você
    expect(githubProviderConfig.id).toBe('github');
    expect(githubProviderConfig.name).toBe('GitHub');
  });

  // Testes para o callback de redirecionamento
  describe('redirect callback', () => {
    const baseUrl = 'https://example.com';

    it('should redirect relative URLs to baseUrl', async () => {
      const url = '/dashboard';
      // Chamamos o callback diretamente para testar sua lógica
      const result = await (authOptions.callbacks?.redirect as Function)({ url, baseUrl });
      expect(result).toBe(`${baseUrl}${url}`);
    });

    it('should redirect absolute URLs with same origin to original URL', async () => {
      const url = 'https://example.com/settings';
      const result = await (authOptions.callbacks?.redirect as Function)({ url, baseUrl });
      expect(result).toBe(url);
    });

    it('should redirect absolute URLs with different origin to baseUrl', async () => {
      const url = 'https://another-domain.com/login';
      const result = await (authOptions.callbacks?.redirect as Function)({ url, baseUrl });
      expect(result).toBe(baseUrl);
    });

    it('should redirect to baseUrl if URL is not valid', async () => {
      const url = 'invalid-url'; // Simula uma URL que não é relativa nem absoluta válida
      const result = await (authOptions.callbacks?.redirect as Function)({ url, baseUrl });
      expect(result).toBe(baseUrl);
    });
  });
});