import React, { useEffect, useState } from 'react';
import { getAuthToken, authHeaders, setAuthToken } from '../utils/api';
import { CSVLink } from "react-csv";


const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


function TableRow({ user, selected, toggleSelect, onEdit, onDelete }) {
  return (
    <tr>
      <td style={{width:32}}><input className="checkbox" type="checkbox" checked={selected} onChange={()=>toggleSelect(user._id)} /></td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.phoneNumber || '-'}</td>
      <td>{user.age || '-'}</td>
      <td>{user.fathersNumber || '-'}</td>
      <td>
        <button className="btn secondary" onClick={()=>onEdit(user)}>Edit</button>
        <button className="btn" onClick={()=>onDelete(user._id)} style={{marginLeft:8}}>Delete</button>
      </td>
    </tr>
  );
}

export default function Dashboard(){
  const [users,setUsers] = useState([]);
  const [selectedIds,setSelectedIds] = useState([]);
  const [page,setPage] = useState(1);
  const [limit,setLimit] = useState(10);
  const [total,setTotal] = useState(0);
  const [sortBy,setSortBy] = useState('name');
  const [order,setOrder] = useState('asc');
  const [editing,setEditing] = useState(null);
  const [loading,setLoading] = useState(false);

  const csvHeaders = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phoneNumber" },
  { label: "Age", key: "age" },
  { label: "Father's Number", key: "fathersNumber" },
    ];


  const token = getAuthToken();
  const headers = { 'Content-Type':'application/json', 'Authorization':'Bearer ' + token };

  useEffect(()=> { fetchUsers(); }, [page, limit, sortBy, order]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND}/api/users?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`, { headers });
    if (res.status === 401) return logout();
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  const toggleSelect = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const selectAllOnPage = () => {
    const idsOnPage = users.map(u=>u._id);
    const allSelected = idsOnPage.every(id => selectedIds.includes(id));
    if (allSelected) setSelectedIds(prev => prev.filter(id => !idsOnPage.includes(id)));
    else setSelectedIds(prev => Array.from(new Set([...selectedIds, ...idsOnPage])));
  };

  const deleteSingle = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`${BACKEND}/api/users/${id}`, { method:'DELETE', headers });
    fetchUsers();
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return alert('Select items first');
    if (!window.confirm(`Delete ${selectedIds.length} users?`)) return;
    await fetch(`${BACKEND}/api/users`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ ids: selectedIds })
    });
    setSelectedIds([]);
    fetchUsers();
  };

  const logout = () => {
    setAuthToken(null);
    window.location.href = '/login';
  };

  const startEdit = (user) => setEditing({...user});
  const saveEdit = async () => {
    const {_id, name, email, phoneNumber, age, fathersNumber } = editing;
    await fetch(`${BACKEND}/api/users/${_id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name, email, phoneNumber, age, fathersNumber })
    });
    setEditing(null);
    fetchUsers();
  };

  const changeSort = col => {
    if (sortBy === col) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setOrder('asc'); }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h3>Users</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={logout}>Logout</button>
            <button className="btn secondary" onClick={deleteSelected} disabled={selectedIds.length===0}>Delete Selected</button>
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={selectAllOnPage} /></th>
                <th onClick={()=>changeSort('name')}>Name {sortBy==='name' ? (order==='asc' ? '▲':'▼') : ''}</th>
                <th onClick={()=>changeSort('email')}>Email {sortBy==='email' ? (order==='asc' ? '▲':'▼') : ''}</th>
                <th onClick={()=>changeSort('phoneNumber')}>Phone</th>
                <th onClick={()=>changeSort('age')}>Age</th>
                <th onClick={()=>changeSort('fathersNumber')}>Father's No.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7}>Loading...</td></tr> :
                users.map(u=>(
                  <TableRow key={u._id} user={u} selected={selectedIds.includes(u._id)} toggleSelect={toggleSelect} onEdit={startEdit} onDelete={deleteSingle} />
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="pager">
          <label className="small">Rows:
            <select value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
          <div style={{marginLeft:12}}>
            <button className="btn secondary" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
            <span style={{padding:'0 10px'}}>{page} / {totalPages}</span>
            <button className="btn secondary" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <CSVLink 
            data={users} 
            headers={csvHeaders} 
            filename="users.csv"
          >
            <button className="btn secondary">Download CSV</button>
          </CSVLink>
        </div>
      </div>


      {editing && (
        <div className="modal">
          <div className="panel">
            <h4>Edit user</h4>
            <div style={{display:'grid',gap:8}}>
              <input className="input" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
              <input className="input" value={editing.email} onChange={e=>setEditing({...editing, email:e.target.value})} />
              <input className="input" value={editing.phoneNumber || ''} onChange={e=>setEditing({...editing, phoneNumber:e.target.value})} />
              <input className="input" type="number" value={editing.age || ''} onChange={e=>setEditing({...editing, age:e.target.value})} />
              <input className="input" value={editing.fathersNumber || ''} onChange={e=>setEditing({...editing, fathersNumber:e.target.value})} />
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="btn" onClick={saveEdit}>Save</button>
                <button className="btn secondary" onClick={()=>setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
