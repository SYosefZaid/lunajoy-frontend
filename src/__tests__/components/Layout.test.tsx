import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Layout from "../../components/Layout";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Layout", () => {
  it("renders navigation and children", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Child</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("Luna Joy")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("New Log")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
