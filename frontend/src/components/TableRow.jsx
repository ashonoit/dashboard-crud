// src/components/TableRow.jsx
import React from "react";

export default function TableRow({ user, selected, toggleSelect, onEdit, onDelete }) {
  return (
    <tr>
      <td style={{ width: 32 }}>
        <input
          className="checkbox"
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(user._id)}
        />
      </td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.phoneNumber || "-"}</td>
      <td>{user.age || "-"}</td>
      <td>{user.fathersNumber || "-"}</td>
      <td>
        <button className="btn" onClick={() => onEdit(user)}>Edit</button>
        <button className="btn" style={{ marginLeft: 8 }} onClick={() => onDelete(user._id)}>Delete</button>
      </td>
    </tr>
  );
}
