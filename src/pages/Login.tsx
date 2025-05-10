import { Container, Typography, Paper, Stack } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { authService } from "../services/api";

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      try {
        const { token, user } = await authService.googleLogin(
          credentialResponse.credential
        );
        login(token, user);
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h2" color="primary" align="center">
          Welcome to Luna Joy
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          Track your mental health journey with ease and privacy
        </Typography>
        <Paper elevation={2} sx={{ p: 4, width: "100%" }}>
          <Stack spacing={2}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Login Failed")}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
