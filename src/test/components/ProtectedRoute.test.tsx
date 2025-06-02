import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSession, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/app/components/Session/ProtectedRoute";

// Mock next-auth and next/navigation hooks
jest.mock("next-auth/react");
jest.mock("next/navigation");

const mockedUseSession = useSession as jest.Mock;
const mockedSignIn = signIn as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsePathname.mockReturnValue("/protected");
  });

  it("renders loading state when session is loading", () => {
    mockedUseSession.mockReturnValue({ status: "loading" });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockedUseSession.mockReturnValue({ status: "authenticated" });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("calls signIn and renders nothing when unauthenticated", async () => {
    mockedUseSession.mockReturnValue({ status: "unauthenticated" });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(undefined, { callbackUrl: "/protected" });
    });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });
});
