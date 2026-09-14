import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// --- Premium Icons ---
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const CheckCircleIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyUrl, setVerifyUrl] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    try {
      setLoading(true);
      setError('');
      const { data } = await API.post('/auth/register', formData);
      if (data.verifyUrl) {
        setVerifyUrl(data.verifyUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <style>{`
        /* Same ultra-clean styles as Login */
        .auth-layout { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 24px; }
        .auth-card { background: white; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); display: flex; overflow: hidden; width: 100%; max-width: 1000px; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); flex-direction: row-reverse; }
        .auth-visual { width: 45%; position: relative; background: #0f172a; display: none; }
        .auth-visual img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .auth-visual-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(15,23,42,0.8)); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; }
        .auth-form-container { width: 100%; padding: 48px 32px; display: flex; flex-direction: column; justify-content: center; }
        .auth-title { font-family: var(--font-serif); font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .auth-subtitle { font-size: 1rem; color: #64748b; margin-bottom: 32px; }
        
        .input-group { position: relative; margin-bottom: 16px; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .auth-input { width: 100%; padding: 16px 16px 16px 48px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; font-size: 1rem; color: #0f172a; transition: all 0.2s ease; }
        .auth-input:focus { background: white; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); outline: none; }
        .pass-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; background: none; border: none; cursor: pointer; }
        .pass-toggle:hover { color: var(--primary); }

        .auth-btn { width: 100%; background: var(--primary); color: white; padding: 16px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 20px rgba(218, 41, 28, 0.2); margin-top: 12px; }
        .auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(218, 41, 28, 0.3); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (min-width: 768px) {
          .auth-visual { display: block; }
          .auth-form-container { width: 55%; padding: 64px 48px; }
        }
      `}</style>

      <div className="auth-card">
        {/* Cinematic Image Side - Flipped for Register */}
        <div className="auth-visual">
          <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" alt="Fresh Ingredients" />
          <div className="auth-visual-overlay">
            <h2 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Join the Studio.</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.5' }}>Create an account to save your favorite orders, track live deliveries, and more.</p>
          </div>
        </div>

        <div className="auth-form-container">
          {verifyUrl ? (
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <CheckCircleIcon />
              </div>
              <h1 className="auth-title" style={{ fontSize: '2rem' }}>Check your inbox!</h1>
              <p className="auth-subtitle" style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                We've sent a verification link to your email address. Please click it to activate your account.
              </p>
              <a href={verifyUrl} className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Verify Account (Dev Mode)
              </a>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join us to start crafting your pizzas.</p>

              {error && <div className="alert alert-danger" style={{ marginBottom: '24px', borderRadius: '12px' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <div className="input-icon"><UserIcon /></div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon"><MailIcon /></div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="auth-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon"><LockIcon /></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="auth-input"
                    style={{ paddingRight: '48px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pass-toggle" aria-label="Toggle password">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                <div className="input-group">
                  <div className="input-icon"><LockIcon /></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="auth-input"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Sign In here</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}