import React from "react";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = require("../../hooks/useAuth").useAuth;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ pathname: "/protected" }),
}));

describe("ProtectedRoute", () => {
  it("renders loading when isLoading is true", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects when not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    // The Navigate component will not render children
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>child</ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
