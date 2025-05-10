import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{
          userId: number;
          email: string;
          name: string;
        }>(token);
        setAuthState({
          user: {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (googleToken: string) => {
    try {
      const response = await authService.googleLogin(googleToken);
      localStorage.setItem("token", response.token);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate("/");
  };

  return {
    ...authState,
    login,
    logout,
  };
}
