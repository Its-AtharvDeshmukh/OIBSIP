import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PackageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ClipboardIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-40)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-20)' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-8)' }}>Operations Hub</span>
          <h1 className="text-h1">Admin Console</h1>
          <p className="text-body-sm text-secondary">Logged in as {admin?.email || 'Administrator'}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Exit Console</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-24)' }}>
        
        {/* Inventory Management Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><PackageIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Inventory Management</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
              Monitor stock levels for bases, sauces, cheeses, and vegetables. Configure low-stock thresholds.
            </p>
          </div>
          <Link to="/admin/inventory" className="btn btn-outline btn-block">Manage Inventory</Link>
        </div>

        {/* Order Management Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><ClipboardIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Order Operations</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
              Review incoming customer orders and progress statuses through kitchen and delivery phases in real time.
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-primary btn-block">Manage Orders</Link>
        </div>

      </div>
    </div>
  );
}