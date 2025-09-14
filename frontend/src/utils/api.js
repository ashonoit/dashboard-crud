// Use Vite's environment variable system
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => localStorage.getItem('token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + getAuthToken(),
});

export default BACKEND;
