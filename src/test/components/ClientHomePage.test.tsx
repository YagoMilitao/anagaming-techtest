import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ClientHomePage from "@/app/components/ClientHomePage";
import { OddData } from "@/data/Odd";

// Mock do contexto de OddsContext
const mockOddsContext = {
  selectedSport: "",
  favoriteSports: [],
  toggleFavoriteSport: jest.fn(),
  allSports: [
    { group: "Futebol", keys: ["soccer_epl", "soccer_laliga"] },
    { group: "Basquete", keys: ["basketball_nba"] },
  ],
};
jest.mock("../context/OddsContext", () => ({
  useOddsContext: () => mockOddsContext,
}));

// Mock da função fetchOddsData
const mockFetchOddsData = jest.fn();
jest.mock("../lib/fetchOdds", () => ({
  fetchOddsData: () => mockFetchOddsData(),
}));

// Mock do componente OddsSkeleton
const MockOddsSkeleton = () => <div data-testid="odds-skeleton">Carregando Odds...</div>;
MockOddsSkeleton.displayName = "MockOddsSkeleton";
jest.mock("./OddsSkeleton", () => MockOddsSkeleton);

// Mock do componente OddsList
const MockOddsList = ({ odds }: { odds: OddData[] }) => (
  <div data-testid="odds-list">
    {odds.map((odd) => (
      <div key={odd.id} data-testid={`odd-item-${odd.id}`}>
        {odd.home_team} vs {odd.away_team}
      </div>
    ))}
  </div>
);
MockOddsList.displayName = "MockOddsList";
jest.mock("./Odds/OddsList", () => MockOddsList);

// Mock do componente UserPanel
const MockUserPanel = ({ session }: { session: any }) => (
  <div data-testid="user-panel">User Panel - {session?.user?.name}</div>
);
MockUserPanel.displayName = "MockUserPanel";
jest.mock("./User/UserPanel", () => MockUserPanel);

// Mock do componente SportsFilter
const MockSportsFilter = () => <div data-testid="sports-filter">Filtro de Esportes</div>;
MockSportsFilter.displayName = "MockSportsFilter";
jest.mock("./Filters/SportsFilter", () => MockSportsFilter);

// Mock do componente DropdownAccordion
const MockDropdownAccordion = ({
  title,
  children,
  count,
  status,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  count?: number;
  status?: string;
}) => (
  <div data-testid={`dropdown-accordion-${status}`}>
    {title} ({count})<div>{children}</div>
  </div>
);
MockDropdownAccordion.displayName = "MockDropdownAccordion";
jest.mock("./DropdownAccordion", () => MockDropdownAccordion);

describe("ClientHomePage", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "url",
    },
    expires: "some date",
  };

  const mockOddsData: OddData[] = [
    {
      id: "1",
      sport_title: "Futebol",
      commence_time: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Jogo ao vivo (começou há 1 hora)
      home_team: "Time A",
      away_team: "Time B",
      bookmakers: [],
      eventId: "1",
      sport: "soccer",
      status: "live",
      sport_key: "soccer_epl",
    },
    {
      id: "2",
      sport_title: "Basquete",
      commence_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Jogo futuro (começa em 1 hora)
      home_team: "Time C",
      away_team: "Time D",
      bookmakers: [],
      eventId: "2",
      sport: "basketball",
      status: "future",
      sport_key: "basketball_nba",
    },
    {
      id: "3",
      sport_title: "Futebol",
      commence_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Jogo finalizado (terminou há 1 hora)
      home_team: "Time E",
      away_team: "Time F",
      bookmakers: [],
      eventId: "3",
      sport: "soccer",
      status: "finished",
      sport_key: "soccer_laliga",
    },
  ] as OddData[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GIVEN the component is loading", () => {
    beforeEach(() => {
      mockFetchOddsData.mockResolvedValue([]);
    });

    it("WHEN the component mounts THEN it should display the OddsSkeleton", () => {
      render(<ClientHomePage session={mockSession as any} />);
      expect(screen.getByTestId("odds-skeleton")).toBeInTheDocument();
    });
  });

  describe("GIVEN the odds data is successfully fetched", () => {
    beforeEach(() => {
      mockFetchOddsData.mockResolvedValue(mockOddsData);
    });

    describe("WHEN the component mounts and data loads", () => {
      it("THEN it should display the UserPanel", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => expect(screen.getByTestId("user-panel")).toBeInTheDocument());
      });

      it("THEN it should display the SportsFilter", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => expect(screen.getByTestId("sports-filter")).toBeInTheDocument());
      });

      it('THEN it should display the "Jogos Ao Vivo" DropdownAccordion with live games', async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() =>
          expect(screen.getByTestId("dropdown-accordion-live")).toHaveTextContent("Jogos Ao Vivo (1)"),
        );
        expect(screen.getByTestId("odds-list")).toHaveTextContent("Time A vs Time B");
      });

      it('THEN it should display the "Jogos Futuros" DropdownAccordion with future games', async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() =>
          expect(screen.getByTestId("dropdown-accordion-future")).toHaveTextContent("Jogos Futuros (1)"),
        );
        expect(screen.getByTestId("odds-list")).toHaveTextContent("Time C vs Time D");
      });

      it('THEN it should display the "Jogos Encerrados" DropdownAccordion with finished games', async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() =>
          expect(screen.getByTestId("dropdown-accordion-finished")).toHaveTextContent("Jogos Encerrados (1)"),
        );
        expect(screen.getByTestId("odds-list")).toHaveTextContent("Time E vs Time F");
      });
    });
  });

  describe("GIVEN the odds data fetch returns an error", () => {
    beforeEach(() => {
      mockFetchOddsData.mockRejectedValue(new Error("Failed to fetch odds"));
    });

    describe("WHEN the component mounts and data loading fails", () => {
      it("THEN it should not display the odds lists", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => expect(screen.queryByTestId("odds-list")).toBeNull());
        // You might want to add an error message display in the component for a better test
      });

      it("THEN it should not be loading", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => expect(screen.queryByTestId("odds-skeleton")).toBeNull());
      });
    });
  });

  describe("GIVEN a sport is selected in the context", () => {
    beforeEach(() => {
      (mockOddsContext as any).selectedSport = "Futebol"; // Type assertion para permitir a modificação
      mockFetchOddsData.mockResolvedValue(mockOddsData);
    });

    describe("WHEN the component mounts", () => {
      it("THEN it should filter the odds based on the selected sport", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => {
          expect(screen.getByTestId("dropdown-accordion-live")).toHaveTextContent("Jogos Ao Vivo (1)");
          expect(screen.getByTestId("dropdown-accordion-future")).toHaveTextContent("Jogos Futuros (0)");
          expect(screen.getByTestId("dropdown-accordion-finished")).toHaveTextContent("Jogos Encerrados (1)");
          expect(screen.getByTestId("odds-list")).toHaveTextContent("Time A vs Time B");
          expect(screen.getByTestId("odds-list")).not.toHaveTextContent("Time C vs Time D");
          expect(screen.getByTestId("odds-list")).toHaveTextContent("Time E vs Time F");
        });
      });
    });
  });

  describe("GIVEN favorite sports exist in the context", () => {
    beforeEach(() => {
      (mockOddsContext as any).favoriteSports = ["Futebol"]; // Type assertion para permitir a modificação
      mockFetchOddsData.mockResolvedValue(mockOddsData);
    });

    describe("WHEN the component renders", () => {
      it('THEN it should display the "Limpar categorias favoritas" button', async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() =>
          expect(screen.getByRole("button", { name: "Limpar categorias favoritas" })).toBeInTheDocument(),
        );
      });

      describe('WHEN the "Limpar categorias favoritas" button is clicked', () => {
        it("THEN it should call toggleFavoriteSport for each favorite sport", async () => {
          render(<ClientHomePage session={mockSession as any} />);
          await waitFor(() => screen.getByRole("button", { name: "Limpar categorias favoritas" }).click());
          expect(mockOddsContext.toggleFavoriteSport).toHaveBeenCalledWith("Futebol");
        });
      });
    });

    describe("WHEN favoriteSports is an empty array", () => {
      beforeEach(() => {
        (mockOddsContext as any).favoriteSports = []; // Type assertion para permitir a modificação
        mockFetchOddsData.mockResolvedValue(mockOddsData);
      });

      it('THEN it should not display the "Limpar categorias favoritas" button', async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() => expect(screen.queryByRole("button", { name: "Limpar categorias favoritas" })).toBeNull());
      });
    });
  });

  describe("GIVEN odds data with invalid commence_time", () => {
    const invalidDateOdds: OddData[] = [
      {
        id: "4",
        sport_title: "Futebol",
        commence_time: "invalid-date",
        home_team: "Time G",
        away_team: "Time H",
        bookmakers: [],
        eventId: "4",
        sport: "soccer",
        status: "live",
        sport_key: "soccer_epl",
      },
    ] as OddData[];

    beforeEach(() => {
      mockFetchOddsData.mockResolvedValue(invalidDateOdds);
    });

    describe("WHEN the component mounts", () => {
      it("THEN it should not throw an error due to invalid date", async () => {
        render(<ClientHomePage session={mockSession as any} />);
        await waitFor(() =>
          expect(screen.getByTestId("dropdown-accordion-live")).toHaveTextContent("Jogos Ao Vivo (0)"),
        );
        // Check console warnings (you might need to mock console.warn for a more robust test)
      });
    });
  });
});
