import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useOddsContext } from "@/features/odds/context/OddsContext";
import SportsFilter from "@/features/odds/components/SportsFilter";

jest.mock("@/app/context/OddsContext");

const mockSetSelectedSport = jest.fn();
const mockToggleFavoriteSport = jest.fn();

const mockContext = {
  allSports: [
    { group: "Soccer", keys: ["A", "B"] },
    { group: "Basketball", keys: ["C"] },
  ],
  selectedSport: "",
  setSelectedSport: mockSetSelectedSport,
  favoriteSports: [],
  toggleFavoriteSport: mockToggleFavoriteSport,
};

function renderWithContext(ctxOverrides = {}) {
  (useOddsContext as jest.Mock).mockReturnValue({
    ...mockContext,
    ...ctxOverrides,
  });
  return render(<SportsFilter />);
}

describe("SportsFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all sports buttons", () => {
    renderWithContext();
    expect(screen.getByText("Soccer")).toBeInTheDocument();
    expect(screen.getByText("Basketball")).toBeInTheDocument();
  });

  it("calls setSelectedSport when a sport is clicked", () => {
    renderWithContext();
    fireEvent.click(screen.getByText("Soccer"));
    expect(mockSetSelectedSport).toHaveBeenCalledWith("Soccer");
  });

  it("shows filled star for favorite sports", () => {
    renderWithContext({ favoriteSports: ["Soccer"] });
    const soccerStar = screen.getAllByRole("button", { name: /Favoritar esporte Soccer/i })[0];
    expect(soccerStar).toHaveTextContent("⭐");
  });

  it("shows empty star for non-favorite sports", () => {
    renderWithContext({ favoriteSports: [] });
    const soccerStar = screen.getAllByRole("button", { name: /Favoritar esporte Soccer/i })[0];
    expect(soccerStar).toHaveTextContent("☆");
  });

  it("calls toggleFavoriteSport when star button is clicked", () => {
    renderWithContext();
    const starButton = screen.getAllByRole("button", { name: /Favoritar esporte Soccer/i })[0];
    fireEvent.click(starButton);
    expect(mockToggleFavoriteSport).toHaveBeenCalledWith("Soccer");
  });

  it("shows 'Limpar filtro de esporte' button when a sport is selected", () => {
    renderWithContext({ selectedSport: "Soccer" });
    expect(screen.getByText("Limpar filtro de esporte")).toBeInTheDocument();
  });

  it("calls setSelectedSport with empty string when clear filter button is clicked", () => {
    renderWithContext({ selectedSport: "Soccer" });
    fireEvent.click(screen.getByText("Limpar filtro de esporte"));
    expect(mockSetSelectedSport).toHaveBeenCalledWith("");
  });

  it("applies selected styles to the selected sport", () => {
    renderWithContext({ selectedSport: "Basketball" });
    const basketballBtn = screen.getByText("Basketball");
    expect(basketballBtn).toHaveClass("bg-blue-600");
    expect(basketballBtn).toHaveClass("text-white");
  });

  it("applies unselected styles to non-selected sports", () => {
    renderWithContext({ selectedSport: "Soccer" });
    const basketballBtn = screen.getByText("Basketball");
    expect(basketballBtn).toHaveClass("bg-gray-200");
    expect(basketballBtn).toHaveClass("text-gray-800");
  });
});
