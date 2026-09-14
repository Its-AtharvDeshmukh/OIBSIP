import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"></path></svg>;

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setError('Please enter both email and password.');
    }
    try {
      setLoading(true);
      setError('');
      const { data } = await API.post('/auth/login', formData);
      loginUser(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-layout::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(218, 41, 28, 0.06) 0%, transparent 70%);
          top: -200px; right: -200px;
          border-radius: 50%;
          z-index: 0;
        }
        .auth-card {
          background: white;
          border-radius: 36px;
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
          display: flex;
          overflow: hidden;
          width: 100%;
          max-width: 1050px;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.8);
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .auth-visual {
          width: 45%;
          position: relative;
          background: #0f172a;
          display: none;
          overflow: hidden;
        }
        .auth-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transform: scale(1.02);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-visual:hover img {
          transform: scale(1.08);
        }
        .auth-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px;
        }
        .auth-form-container {
          width: 100%;
          padding: 56px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary-soft);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          width: fit-content;
        }
        .auth-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .auth-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .input-group {
          position: relative;
          margin-bottom: 24px;
        }
        .input-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 18px;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        .auth-input {
          width: 100%;
          padding: 16px 16px 16px 52px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          font-size: 1rem;
          font-family: inherit;
          color: #0f172a;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-input:hover {
          border-color: #cbd5e1;
          background: #fff;
        }
        .auth-input:focus {
          background: white;
          border-color: var(--primary);
          box-shadow: 0 0 0 5px var(--primary-soft);
          outline: none;
        }
        .auth-input:focus ~ .input-icon {
          color: var(--primary);
        }
        .pass-toggle {
          position: absolute;
          right: 18px;
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }
        .pass-toggle:hover { color: #0f172a; }
        .auth-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          padding: 18px;
          border-radius: 18px;
          font-size: 1.05rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px rgba(218, 41, 28, 0.25);
          margin-top: 8px;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(218, 41, 28, 0.35);
        }
        .auth-btn:active { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .auth-visual { display: block; width: 45%; }
          .auth-form-container { width: 55%; padding: 64px 56px; }
        }
      `}</style>
      <div className="auth-card">
        
        {/* Left Side: Cinematic Visual Showcase */}
        <div className="auth-visual">
          <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1000&q=80" alt="Artisanal Pizza Craft" />
          <div className="auth-visual-overlay">
            <span style={{ color: '#fca5a5', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              The Kitchen Awaits
            </span>
            <h2 style={{ color: 'white', fontSize: '2.25rem', fontFamily: 'var(--font-serif)', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>
              Crafted for perfection.
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Sign in to track your live deliveries or enter the studio to build your custom masterpiece.
            </p>
          </div>
        </div>

        {/* Right Side: High-End Interactive Form */}
        <div className="auth-form-container">
          <div className="brand-pill">
            <SparkleIcon /> Pizza Craft Secure Portal
          </div>
          
          <h1 className="auth-title">Welcome back.</h1>
          <p className="auth-subtitle">Please enter your credentials to access your account.</p>

          {error && <div className="alert alert-danger" style={{ marginBottom: '24px', borderRadius: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon"><MailIcon /></div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              
              <div className="input-wrapper">
                <div className="input-icon"><LockIcon /></div>
                <input
  id="password"
  type={showPassword ? "text" : "password"}
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="********" 
  className="auth-input"
  style={{ paddingRight: '52px' }}
  required
/>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pass-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? 'Authenticating...' : 'Sign In to Kitchen'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Create one now</Link>
          </p>

        </div>
      </div>
    </div>
  );
}