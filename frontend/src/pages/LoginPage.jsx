// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../utils/api";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) return setErr("Fill all fields");
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuthToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/dashboard");
    } catch (err) {
      setErr(err.response?.data?.message || err.message || "Server error");
    }
  };

  const handleGoogle = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#000000ff",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Sign In
          </Typography>

          <form onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              inputProps={{ minLength: 6 }}
            />

            {err && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {err}
              </Typography>
            )}

            <Box display="flex" gap={2} mb={2}>
              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => nav("/register")}
              >
                Register
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleGoogle}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
