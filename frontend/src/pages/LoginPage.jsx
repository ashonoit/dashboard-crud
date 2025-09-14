import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BACKEND, { setAuthToken } from '../utils/api';

export default function LoginPage(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) return setErr('Fill all fields');
    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || data.error || 'Login failed');
      setAuthToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/dashboard');
    } catch (err) {
      setErr('Server error');
    }
  };

  const handleGoogle = () => {
    window.location.href = `${BACKEND}/auth/google`;
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
        <div className="header">
          <h2>Sign in</h2>
          {/* <div className="small">Dark • Minimal</div> */}
        </div>
        <form onSubmit={submit}>
          <div style={{marginBottom:12}}>
            <label className="small">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div style={{marginBottom:12}}>
            <label className="small">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
          </div>
          {err && <div style={{color:'#ff6b6b', marginBottom:8}}>{err}</div>}
          <div style={{display:'flex',gap:8}}>
            <button className="btn" type="submit">Login</button>
            <button type="button" className="btn secondary" onClick={()=>nav('/register')}>Register</button>
          </div>
        </form>
        <hr style={{margin:'18px 0',borderColor:'rgba(255,255,255,0.03)'}}/>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={handleGoogle}>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
}
