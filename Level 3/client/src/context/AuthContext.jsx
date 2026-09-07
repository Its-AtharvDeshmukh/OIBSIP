import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userToken = localStorage.getItem('userToken');
      const adminData = localStorage.getItem('adminUser');
      const adminToken = localStorage.getItem('adminToken');

      if (adminToken && adminData) {
        setAdmin(JSON.parse(adminData));
      }

      if (userToken) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
        } catch (err) {
          localStorage.removeItem('userToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('userToken', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);