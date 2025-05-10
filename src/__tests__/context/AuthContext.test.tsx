import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/AuthContext";

describe("AuthContext", () => {
  it("provides context values", () => {
    let contextValue;
    function TestComponent() {
      contextValue = useAuth();
      return <div>test</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(contextValue).toHaveProperty("isAuthenticated");
    expect(contextValue).toHaveProperty("isLoading");
    expect(contextValue).toHaveProperty("logout");
  });
});
