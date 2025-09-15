// src/components/EditUserModal.jsx
import React from "react";

export default function EditUserModal({ editing, setEditing, saveEdit }) {
  if (!editing) return null;

  return (
    <div className="modal">
      <div className="panel">
        <h4>Edit user</h4>
        <div style={{ display: "grid", gap: 8 }}>
          <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Enter Name" />
          <input className="input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} placeholder="Enter Email" />
          <input className="input" value={editing.phoneNumber || ""} onChange={(e) => setEditing({ ...editing, phoneNumber: e.target.value })} placeholder="Enter Number" />
          <input className="input" type="number" value={editing.age || ""} onChange={(e) => setEditing({ ...editing, age: e.target.value })} placeholder="Enter Age" />
          <input className="input" value={editing.fathersNumber || ""} onChange={(e) => setEditing({ ...editing, fathersNumber: e.target.value })} placeholder="Enter Father's Number" />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={saveEdit}>Save</button>
            <button className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
