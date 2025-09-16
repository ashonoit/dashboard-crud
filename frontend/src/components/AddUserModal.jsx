import React, { useState } from "react";
import api from "../utils/api";

export default function AddUserModal({ open, setOpen, fetchUsers }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    fathersNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users", form);
      fetchUsers(); // refresh user list
      setForm({ name: "", email: "", phoneNumber: "", age: "", fathersNumber: "" });
      setOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error adding user");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add User</h3>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Father's Number</label>
            <input
              type="text"
              name="fathersNumber"
              value={form.fathersNumber}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn">Add</button>
            <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
