// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../utils/api";
import AddUserModal from "../components/AddUserModal";
import UserTable from "../components/UserTable";
import PaginationControls from "../components/PaginationControls";
import EditUserModal from "../components/EditUserModal";
import DownloadCSVButton from "../components/DownloadCSVButton";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortBy, order]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/users?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      if (err.response?.status === 401) return logout();
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllOnPage = () => {
    const idsOnPage = users.map((u) => u._id);
    const allSelected = idsOnPage.every((id) => selectedIds.includes(id));
    if (allSelected)
      setSelectedIds((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...idsOnPage])));
  };

  const deleteSingle = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/api/users/${id}`);
    fetchUsers();
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return alert("Select items first");
    if (!window.confirm(`Delete ${selectedIds.length} users?`)) return;
    await api.delete("/api/users", { data: { ids: selectedIds } });
    setSelectedIds([]);
    fetchUsers();
  };

  const logout = () => {
    setAuthToken(null);
    window.location.href = "/login";
  };

  const addUser = async (user) => {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      console.error("Failed to add user");
    }
  };

  const startEdit = (user) => setEditing({ ...user });
  const saveEdit = async () => {
    const { _id, name, email, phoneNumber, age, fathersNumber } = editing;
    await api.put(`/api/users/${_id}`, {
      name,
      email,
      phoneNumber,
      age,
      fathersNumber,
    });
    setEditing(null);
    fetchUsers();
  };

  const changeSort = (col) => {
    if (sortBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(col);
      setOrder("asc");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      {/* <Navbar /> */}
      <Container maxWidth="lg">
        <Paper
          elevation={5}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: "#fafafa",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Users
            </Typography>
            <Box display="flex" gap={2}>
              <DownloadCSVButton users={users} />
              <Button
                variant="contained"
                color="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <UserTable
              users={users}
              selectedIds={selectedIds}
              toggleSelect={toggleSelect}
              onEdit={startEdit}
              onDelete={deleteSingle}
              selectAllOnPage={selectAllOnPage}
              loading={loading}
              sortBy={sortBy}
              order={order}
              changeSort={changeSort}
            />
          )}

          <PaginationControls
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
          />

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAdding(true)}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/payments/new")}
              sx={{ ml: "auto" }}
            >
              Make a Payment
            </Button>
          </Box>
        </Paper>
      </Container>

      <EditUserModal
        editing={editing}
        setEditing={setEditing}
        saveEdit={saveEdit}
      />

      <AddUserModal open={adding} setOpen={setAdding} fetchUsers={fetchUsers} />
    </>
  );
}
