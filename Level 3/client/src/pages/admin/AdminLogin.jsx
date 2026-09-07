import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setError('Please enter both admin email and password.');
    }

    try {
      setLoading(true);
      setError('');
      
      // Request admin authentication token from backend
      const { data } = await API.post('/auth/admin/login', formData);
      
      // Store token explicitly as adminToken
      localStorage.setItem('adminToken', data.token);
      if (loginAdmin) {
        loginAdmin(data.token, data.admin);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: 'var(--space-32) var(--space-16)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', borderTop: '4px solid var(--primary)', padding: 'var(--space-32)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Staff Portal</span>
          <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Admin Sign In</h1>
          <p className="text-body-sm text-secondary">
            Secure access for Pizza Craft kitchen and menu managers.
          </p>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-20)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }} htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="admin@pizza.com"
              required
            />
          </div>

          <div style={{ marginBottom: 'var(--space-24)' }}>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }} htmlFor="password">Security Passkey</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: 'var(--space-16)', fontWeight: '700' }}>
            {loading ? 'Authenticating...' : 'Secure Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
}