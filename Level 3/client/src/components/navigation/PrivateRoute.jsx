import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p className="text-body-lg text-muted">Verifying session...</p>
      </div>
    );
  }

  // If the user is not authenticated, redirect them to the login page.
  // The 'replace' prop prevents the redirected route from pushing into browser history.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}