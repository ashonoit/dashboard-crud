// src/components/UserTable.jsx
import React from "react";
import TableRow from "./TableRow";

export default function UserTable({ users, selectedIds, toggleSelect, onEdit, onDelete, selectAllOnPage, loading, sortBy, order, changeSort }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={selectAllOnPage} /></th>
            <th onClick={() => changeSort("name")}>Name {sortBy === "name" ? (order === "asc" ? "▲" : "▼") : ""}</th>
            <th onClick={() => changeSort("email")}>Email {sortBy === "email" ? (order === "asc" ? "▲" : "▼") : ""}</th>
            <th onClick={() => changeSort("phoneNumber")}>Phone</th>
            <th onClick={() => changeSort("age")}>Age</th>
            <th onClick={() => changeSort("fathersNumber")}>Father's No.</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7}>Loading...</td></tr>
          ) : (
            users.map((u) => (
              <TableRow
                key={u._id}
                user={u}
                selected={selectedIds.includes(u._id)}
                toggleSelect={toggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
