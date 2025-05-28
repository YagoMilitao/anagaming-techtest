import React from "react";
import { render, screen } from "@testing-library/react";

import { Session } from "next-auth";
import UserPanel from "@/app/components/User/UserPanel";

describe("UserPanel", () => {
    it("renders the user's name when session is provided", () => {
        const session: Session = {
            user: { name: "Alice", email: "alice@example.com", image: null },
            expires: "2099-01-01T00:00:00.000Z",
        };

        render(<UserPanel session={session} />);
        expect(screen.getByText(/Bem-vindo, /)).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("renders without crashing when user name is missing", () => {
        const session: Session = {
            user: { name: undefined, email: "bob@example.com", image: null },
            expires: "2099-01-01T00:00:00.000Z",
        };

        render(<UserPanel session={session} />);
        expect(screen.getByText(/Bem-vindo, /)).toBeInTheDocument();
    });
});