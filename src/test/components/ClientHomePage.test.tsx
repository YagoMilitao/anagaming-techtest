import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ClientHomePage from "@/app/components/ClientHomePage";
import { useOddsContext } from "@/app/context/OddsContext";


// Mock child components
jest.mock("../../../app/components/UserPanel", () => () => <div data-testid="user-panel" />);
jest.mock("../../../app/components/Odds/OddsList", () => ({ odds }: any) => (
    <div data-testid="odds-list">{odds.length} odds</div>
));
jest.mock("../../../app/components/DropdownAccordion", () => ({ children, title, count, status }: any) => (
    <div data-testid={`dropdown-${status}`}>
        <div>{title}</div>
        <div data-testid={`count-${status}`}>{count}</div>
        {children}
    </div>
));
jest.mock("../../../app/components/Filters/SportsFilter", () => () => <div data-testid="sports-filter" />);

// Mock context
const mockUseOddsContext = useOddsContext as jest.Mock;
jest.mock("../../../app/context/OddsContext", () => ({
    useOddsContext: jest.fn(),
}));

const mockSession = { user: { name: "Test User" } };

const now = Date.now();
const threeHours = 3 * 60 * 60 * 1000;

const mockOdds = [
    // Live game
    {
        id: "1",
        sport_key: "soccer",
        commence_time: new Date(now - 1000 * 60).toISOString(),
    },
    // Future game
    {
        id: "2",
        sport_key: "soccer",
        commence_time: new Date(now + threeHours).toISOString(),
    },
    // Finished game
    {
        id: "3",
        sport_key: "soccer",
        commence_time: new Date(now - threeHours - 1000 * 60).toISOString(),
    },
];

describe("ClientHomePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default context mock
        (useOddsContext as jest.Mock).mockReturnValue({
            selectedSport: "Soccer",
            favoriteSports: [],
            toggleFavoriteSport: jest.fn(),
            allSports: [
                { group: "Soccer", keys: ["soccer"] },
                { group: "Basketball", keys: ["basketball"] },
            ],
        });
        // Default fetchOddsData mock
        jest.spyOn(Date, "now").mockImplementation(() => now);
    });

    it("renders loading state initially", async () => {
        render(<ClientHomePage session={mockSession} />);
        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument());
    });

    it("renders UserPanel and SportsFilter", async () => {
        render(<ClientHomePage session={mockSession} />);
        await waitFor(() => expect(screen.getByTestId("user-panel")).toBeInTheDocument());
        expect(screen.getByTestId("sports-filter")).toBeInTheDocument();
    });

    it("renders odds in correct categories", async () => {
        render(<ClientHomePage session={mockSession} />);
        await waitFor(() => {
            expect(screen.getByTestId("dropdown-live")).toBeInTheDocument();
            expect(screen.getByTestId("dropdown-future")).toBeInTheDocument();
            expect(screen.getByTestId("dropdown-finished")).toBeInTheDocument();
        });

        expect(screen.getByTestId("count-live")).toHaveTextContent("1");
        expect(screen.getByTestId("count-future")).toHaveTextContent("1");
        expect(screen.getByTestId("count-finished")).toHaveTextContent("1");
    });

    it("filters odds by selected sport", async () => {
        (useOddsContext as jest.Mock).mockReturnValue({
            selectedSport: "Basketball",
            favoriteSports: [],
            toggleFavoriteSport: jest.fn(),
            allSports: [
                { group: "Soccer", keys: ["soccer"] },
                { group: "Basketball", keys: ["basketball"] },
            ],
        });
        render(<ClientHomePage session={mockSession} />);
        await waitFor(() => {
            expect(screen.getByTestId("dropdown-live")).toBeInTheDocument();
        });
        // No basketball odds in mockOdds
        expect(screen.getByTestId("count-live")).toHaveTextContent("0");
        expect(screen.getByTestId("count-future")).toHaveTextContent("0");
        expect(screen.getByTestId("count-finished")).toHaveTextContent("0");
    });

    it("shows clear favorites button when favoriteSports is not empty and triggers toggleFavoriteSport", async () => {
        const toggleFavoriteSport = jest.fn();
        (useOddsContext as jest.Mock).mockReturnValue({
            selectedSport: "Soccer",
            favoriteSports: ["soccer", "basketball"],
            toggleFavoriteSport,
            allSports: [
                { group: "Soccer", keys: ["soccer"] },
                { group: "Basketball", keys: ["basketball"] },
            ],
        });
        render(<ClientHomePage session={mockSession} />);
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Limpar categorias favoritas/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Limpar categorias favoritas/i }));
        expect(toggleFavoriteSport).toHaveBeenCalledTimes(2);
        expect(toggleFavoriteSport).toHaveBeenCalledWith("soccer");
        expect(toggleFavoriteSport).toHaveBeenCalledWith("basketball");
    });
});