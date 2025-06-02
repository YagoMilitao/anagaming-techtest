import React from "react";
import { render, screen } from "@testing-library/react";
import { FilterProvider, useFilter } from "../../features/odds/context/FilterContext";

const TestComponent = () => {
  const { selectedSport, setSelectedSport, selectedLeague, setSelectedLeague } = useFilter();

  return (
    <div>
      <span data-testid="sport">{selectedSport}</span>
      <span data-testid="league">{selectedLeague}</span>
      <button onClick={() => setSelectedSport("Football")}>Set Sport</button>
      <button onClick={() => setSelectedLeague("Premier League")}>Set League</button>
      <button onClick={() => setSelectedSport(null)}>Clear Sport</button>
      <button onClick={() => setSelectedLeague(null)}>Clear League</button>
    </div>
  );
};

describe("FilterContext", () => {
  it("provides default values", () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>,
    );
    expect(screen.getByTestId("sport").textContent).toBe("");
    expect(screen.getByTestId("league").textContent).toBe("");
  });

  it("updates selectedSport and selectedLeague", () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>,
    );
    screen.getByText("Set Sport").click();
    expect(screen.getByTestId("sport").textContent).toBe("Football");
    screen.getByText("Set League").click();
    expect(screen.getByTestId("league").textContent).toBe("Premier League");
  });

  it("clears selectedSport and selectedLeague", () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>,
    );
    screen.getByText("Set Sport").click();
    screen.getByText("Set League").click();
    screen.getByText("Clear Sport").click();
    screen.getByText("Clear League").click();
    expect(screen.getByTestId("sport").textContent).toBe("");
    expect(screen.getByTestId("league").textContent).toBe("");
  });

  it("throws error if useFilter is used outside FilterProvider", () => {
    const ErrorComponent = () => {
      useFilter();
      return null;
    };
    // Suppress error output for this test
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ErrorComponent />)).toThrow("useFilter must be used within FilterProvider");
    spy.mockRestore();
  });
});
