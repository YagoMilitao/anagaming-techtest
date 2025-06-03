import { useOddsListState } from "@/features/hooks/oddsListState";
import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/navigation"; // Hook a ser mockado

// Mock do useRouter de next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useOddsListState", () => {
  const mockPush = jest.fn(); // Mock da função push do router

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockPush.mockClear();
    // Configura o mock de useRouter para retornar um objeto com o push mockado
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      // Se outros métodos do router forem usados no hook, eles também precisariam ser mockados aqui
      // ex: replace: jest.fn(),
      // ex: prefetch: jest.fn(),
    });
  });

  it("should return navigateToDetails function", () => {
    const { result } = renderHook(() => useOddsListState());

    // Verifica se a função navigateToDetails é retornada pelo hook
    expect(typeof result.current.navigateToDetails).toBe("function");
  });

  it("should call router.push with the correct URL when navigateToDetails is called", () => {
    const { result } = renderHook(() => useOddsListState());

    const sportKey = "soccer_epl";
    const id = "match-123";
    const expectedUrl = `/sports/${sportKey}/${id}`; // A URL esperada

    // Chama a função navigateToDetails
    act(() => {
      result.current.navigateToDetails(sportKey, id);
    });

    // Verifica se router.push foi chamado uma vez
    expect(mockPush).toHaveBeenCalledTimes(1);
    // Verifica se router.push foi chamado com a URL correta
    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });
});
