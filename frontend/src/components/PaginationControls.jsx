// src/components/PaginationControls.jsx
import React from "react";

export default function PaginationControls({ page, setPage, totalPages, limit, setLimit }) {
  return (
    <div className="pager">
      <label className="small">
        Rows:
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
      <div style={{ marginLeft: 12 }}>
        <button className="btn secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span style={{ padding: "0 10px" }}>{page} / {totalPages}</span>
        <button className="btn secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}
