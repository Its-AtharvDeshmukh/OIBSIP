import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const PackageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ClipboardIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const UsersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const UtensilsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path><path d="M15 2v20"></path><path d="M5 2v5a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3V2"></path><path d="M8 10v12"></path></svg>;

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0, totalPizzas: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentRes, menuRes] = await Promise.all([
          API.get('/admin/students'),
          API.get('/admin/menu')
        ]);
        setStats({ 
          totalStudents: studentRes.data.count || (studentRes.data.data || []).length,
          totalPizzas: (menuRes.data.data || []).length
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-24)' }}>
        
        {/* Menu Management Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><UtensilsIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Menu Management</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-12)' }}>
              Add new pizzas, edit pricing, or toggle availability.
            </p>
            <p className="text-h4" style={{ marginBottom: 'var(--space-24)' }}>{stats.totalPizzas} Listings Active</p>
          </div>
          <Link to="/admin/menu" className="btn btn-primary btn-block">Manage Menu</Link>
        </div>

        {/* Student Management Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><UsersIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Student Management</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-12)' }}>
              Create, verify, and manage active student accounts.
            </p>
            <p className="text-h4" style={{ marginBottom: 'var(--space-24)' }}>{stats.totalStudents} Enrolled</p>
          </div>
          <Link to="/admin/students" className="btn btn-outline btn-block">Manage Students</Link>
        </div>

        {/* Inventory Management Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><PackageIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Inventory Management</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
              Monitor stock levels for bases, sauces, cheeses, and vegetables.
            </p>
          </div>
          <Link to="/admin/inventory" className="btn btn-outline btn-block">Manage Inventory</Link>
        </div>

        {/* Order Operations Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-16)' }}><ClipboardIcon /></div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Order Operations</h3>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
              Review incoming customer orders and progress statuses in real time.
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline btn-block">Manage Orders</Link>
        </div>

      </div>
    </div>
  );
}