import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function RegisterPage(){
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phoneNumber:'', age:'', fathersNumber:''});
  const [err, setErr] = useState('');

  const change = (k, v) => setForm(prev => ({...prev, [k]: v}));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.name || !form.email || !form.password) return setErr('Please fill required fields');

    try {
      await api.post('/auth/register', form);
      alert('Registered successfully. Please login.');
      nav('/login');
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.message || err.message || 'Server error');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:620, margin:'40px auto'}}>
        <div className="header">
          <h2>Create account</h2>
        </div>
        <form onSubmit={submit}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label className="small">Full name*</label>
              <input className="input" value={form.name} onChange={e=>change('name', e.target.value)} required />
            </div>
            <div>
              <label className="small">Email*</label>
              <input className="input" type="email" value={form.email} onChange={e=>change('email', e.target.value)} required />
            </div>
            <div>
              <label className="small">Password*</label>
              <input className="input" type="password" value={form.password} onChange={e=>change('password', e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="small">Phone</label>
              <input className="input" value={form.phoneNumber} onChange={e=>change('phoneNumber', e.target.value)} />
            </div>
            <div>
              <label className="small">Age</label>
              <input className="input" type="number" value={form.age} onChange={e=>change('age', e.target.value)} />
            </div>
            <div>
              <label className="small">Father's Number</label>
              <input className="input" value={form.fathersNumber} onChange={e=>change('fathersNumber', e.target.value)} />
            </div>
          </div>
          {err && <div style={{color:'#ff6b6b', marginTop:8}}>{err}</div>}
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <button className="btn" type="submit">Create account</button>
            <button type="button" className="btn secondary" onClick={()=>nav('/login')}>Back to login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
