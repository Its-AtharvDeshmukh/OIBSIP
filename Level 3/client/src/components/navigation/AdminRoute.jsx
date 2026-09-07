import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
  const { admin, loading } = useAuth();
  const localAdminToken = localStorage.getItem('adminToken');

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p className="text-body text-secondary">Verifying admin credentials...</p>
      </div>
    );
  }

  // Allow access if admin state exists in context or adminToken exists in localStorage
  if (!admin && !localAdminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}