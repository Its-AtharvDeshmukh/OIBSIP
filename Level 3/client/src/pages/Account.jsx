import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple SVG Icons
const HistoryIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline></svg>;
const PizzaIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/><path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/></svg>;
const LogoutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

export default function Account() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) return null;

  // Extract initials for the avatar
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-64) var(--space-16)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: 'var(--space-40) var(--space-32)' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-40)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-32)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: 'var(--radius-pill)', 
            backgroundColor: 'var(--primary-soft)', 
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: 'var(--space-16)'
          }}>
            {initials}
          </div>
          <h1 className="text-h2" style={{ marginBottom: 'var(--space-4)' }}>{user.name}</h1>
          <p className="text-body text-secondary">{user.email}</p>
          <span className="badge badge-success" style={{ marginTop: 'var(--space-12)' }}>Verified Customer</span>
        </div>

        {/* Action Menu */}
        <h3 className="text-h4" style={{ marginBottom: 'var(--space-16)' }}>Account Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          
          <Link to="/orders" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', padding: 'var(--space-16)' }}>
            <HistoryIcon /> 
            <span style={{ marginLeft: 'var(--space-8)' }}>View Order History</span>
          </Link>
          
          <Link to="/builder" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', padding: 'var(--space-16)' }}>
            <PizzaIcon /> 
            <span style={{ marginLeft: 'var(--space-8)' }}>Craft a New Pizza</span>
          </Link>
          
          <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', padding: 'var(--space-16)', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}>
            <LogoutIcon /> 
            <span style={{ marginLeft: 'var(--space-8)' }}>Sign Out</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}