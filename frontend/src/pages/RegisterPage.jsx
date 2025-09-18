// frontend/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";

export default function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
    fathersNumber: "",
  });
  const [err, setErr] = useState("");

  const change = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.password)
      return setErr("Please fill required fields");

    try {
      await api.post("/auth/register", form);
      alert("Registered successfully. Please login.");
      nav("/login");
    } catch (err) {
      setErr(err.response?.data?.message || err.message || "Server error");
    }
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
            Create Account
          </Typography>

          <form onSubmit={submit}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name*"
                  fullWidth
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email*"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => change("email", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password*"
                  type="password"
                  fullWidth
                  value={form.password}
                  onChange={(e) => change("password", e.target.value)}
                  required
                  inputProps={{ minLength: 6 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={form.phoneNumber}
                  onChange={(e) => change("phoneNumber", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={form.age}
                  onChange={(e) => change("age", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Father's Number"
                  fullWidth
                  value={form.fathersNumber}
                  onChange={(e) => change("fathersNumber", e.target.value)}
                />
              </Grid>
            </Grid>

            {err && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {err}
              </Typography>
            )}

            <Box display="flex" gap={2} mt={3}>
              <Button type="submit" variant="contained" fullWidth>
                Create Account
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => nav("/login")}
              >
                Back to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
