// src/components/Navbar.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Dashboard
        </Typography>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button color="inherit" component={Link} to="/payments/new">
            Pay
          </Button>
          <Button color="inherit" component={Link} to="/payments/history">
            Payment History
          </Button>
          <Button color="inherit" component={Link} to="/payments/status">
            Status
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
