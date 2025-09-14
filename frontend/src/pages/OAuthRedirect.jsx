import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken } from '../utils/api';

export default function OAuthRedirect(){
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(()=>{
    const q = new URLSearchParams(loc.search);
    const token = q.get('token');
    if (token) {
      setAuthToken(token);
      nav('/dashboard');
    } else {
      nav('/login');
    }
  },[loc,nav]);

  return <div style={{padding:40}}>Signing you in...</div>;
}
