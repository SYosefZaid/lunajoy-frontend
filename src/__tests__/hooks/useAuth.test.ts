import { renderHook } from "@testing-library/react";
import { useAuth } from "../../hooks/useAuth";
import * as AuthContext from "../../context/AuthContext";

describe("useAuth", () => {
  it("returns context values", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
