import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthRedirect from './pages/OAuthRedirect';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootRedirect />} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/oauth2redirect' element={<OAuthRedirect/>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
