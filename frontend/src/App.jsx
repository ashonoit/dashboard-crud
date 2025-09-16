import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthRedirect from './pages/OAuthRedirect';
import Dashboard from './pages/Dashboard';
import PublicRoute from '../routes/PublicRoute';



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
        <Route path='/login' element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><RegisterPage/></PublicRoute>} />
        <Route path='/oauth2redirect' element={<PublicRoute><OAuthRedirect/></PublicRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="*" element={<RootRedirect />} /> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
