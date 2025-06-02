import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DropdownAccordion from "@/app/components/DropdownAccordion";

describe("DropdownAccordion", () => {
  it("renders the title", () => {
    render(<DropdownAccordion title="Test Title">Content</DropdownAccordion>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children when defaultOpen is true", () => {
    render(
      <DropdownAccordion title="Open" defaultOpen>
        <div>Accordion Content</div>
      </DropdownAccordion>,
    );
    expect(screen.getByText("Accordion Content")).toBeInTheDocument();
  });

  it("does not render children when defaultOpen is false", () => {
    render(
      <DropdownAccordion title="Closed">
        <div>Accordion Content</div>
      </DropdownAccordion>,
    );
    expect(screen.queryByText("Accordion Content")).not.toBeInTheDocument();
  });

  it("toggles content visibility when button is clicked", () => {
    render(
      <DropdownAccordion title="Toggle">
        <div>Accordion Content</div>
      </DropdownAccordion>,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("Accordion Content")).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText("Accordion Content")).not.toBeInTheDocument();
  });

  it("shows count if provided", () => {
    render(
      <DropdownAccordion title="With Count" count={5}>
        Content
      </DropdownAccordion>,
    );
    expect(screen.getByText("(5)")).toBeInTheDocument();
  });

  it("renders live status indicator with animation", () => {
    render(
      <DropdownAccordion title="Live" status="live">
        Content
      </DropdownAccordion>,
    );
    expect(screen.getByLabelText("Indicador de jogos ao vivo pulsante")).toBeInTheDocument();
  });

  it("renders future status indicator", () => {
    render(
      <DropdownAccordion title="Future" status="future">
        Content
      </DropdownAccordion>,
    );
    expect(screen.getByLabelText("Indicador de jogos future")).toBeInTheDocument();
  });

  it("renders finished status indicator", () => {
    render(
      <DropdownAccordion title="Finished" status="finished">
        Content
      </DropdownAccordion>,
    );
    expect(screen.getByLabelText("Indicador de jogos finished")).toBeInTheDocument();
  });

  it("button has correct aria-expanded attribute", () => {
    render(
      <DropdownAccordion title="Aria" defaultOpen={false}>
        Content
      </DropdownAccordion>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
