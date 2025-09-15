// src/components/DownloadCSVButton.jsx
import React from "react";
import { CSVLink } from "react-csv";

export default function DownloadCSVButton({ users }) {
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Age", key: "age" },
    { label: "Father's Number", key: "fathersNumber" },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
      <CSVLink data={users} headers={csvHeaders} filename="users.csv">
        <button className="btn secondary">Download CSV</button>
      </CSVLink>
    </div>
  );
}
