import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Check frontend URL pathname instead of backend endpoint URL
    const isAdminPanel = window.location.pathname.startsWith('/admin');
    
    const token = isAdminPanel
      ? localStorage.getItem('adminToken')
      : (localStorage.getItem('token') || localStorage.getItem('userToken'));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;