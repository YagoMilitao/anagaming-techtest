import { getOddDetails } from "@/features/odds/services/oddsService"; // Função a ser mockada
import { notFound } from "next/navigation"; // Função a ser mockada
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import OddDetailPage from "@/features/bets/[id]/page";

// Mocks necessários
jest.mock("@/features/odds/services/oddsService", () => ({
  getOddDetails: jest.fn(),
}));

jest.mock("@/features/odds/components/OddDetailsDisplay", () => ({
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  OddDetailsDisplay: ({ odd }: any) => (
    <div data-testid="odd-details-display" data-odd={JSON.stringify(odd)}>
      Odd Details Display Content
    </div>
  ),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(), // Mocka a função notFound
}));

describe("OddDetailPage", () => {
  const mockGetOddDetails = getOddDetails as jest.Mock;
  const mockNotFound = notFound as unknown as jest.Mock;

  const MOCK_ODD_DATA = {
    id: "odd-123",
    homeTeam: "Time A",
    awayTeam: "Time B",
    sport: "Futebol",
    commenceTime: "2025-06-02T20:00:00Z",
    bookmakers: [],
  };

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockGetOddDetails.mockClear();
    mockNotFound.mockClear();
    // Define um mock padrão para getOddDetails (sucesso)
    mockGetOddDetails.mockResolvedValue(MOCK_ODD_DATA);
  });

  // ======================================
  // Testes de Renderização
  // ======================================
  it("should render OddDetailsDisplay with data when getOddDetails is successful", async () => {
    render(await OddDetailPage({ params: { id: "odd-123" } }));

    // Verifica se getOddDetails foi chamado com o ID correto
    expect(mockGetOddDetails).toHaveBeenCalledTimes(1);
    expect(mockGetOddDetails).toHaveBeenCalledWith("odd-123");

    // Verifica se OddDetailsDisplay foi renderizado
    const oddDetailsDisplay = screen.getByTestId("odd-details-display");
    expect(oddDetailsDisplay).toBeInTheDocument();
    // Verifica se os dados corretos foram passados para OddDetailsDisplay
    expect(oddDetailsDisplay).toHaveAttribute("data-odd", JSON.stringify(MOCK_ODD_DATA));
  });

  // ======================================
  // Testes de Erro e não encontrado
  // ======================================
  it("should call notFound() when odd data is not found (null)", async () => {
    mockGetOddDetails.mockResolvedValue(null); // Simula dados não encontrados

    // Renderiza o componente e espera que notFound seja chamado
    await OddDetailPage({ params: { id: "non-existent-odd" } });

    expect(mockGetOddDetails).toHaveBeenCalledTimes(1);
    expect(mockGetOddDetails).toHaveBeenCalledWith("non-existent-odd");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    // Garante que OddDetailsDisplay não foi renderizado
    expect(screen.queryByTestId("odd-details-display")).not.toBeInTheDocument();
  });
});
