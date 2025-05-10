import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Luna Joy
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button component={RouterLink} to="/" color="inherit">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/log" color="inherit">
              New Log
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
