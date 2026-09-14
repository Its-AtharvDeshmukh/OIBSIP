import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// --- Premium UI Icons ---
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const SendIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const PizzaIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/><path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/></svg>;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');
    try {
      setLoading(true);
      setError('');
      const { data } = await API.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error requesting reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <style>{`
        .auth-layout { display: flex; min-height: 100vh; background: #ffffff; }
        
        .auth-banner {
          display: none; width: 50%; position: relative; overflow: hidden; background: #f8fafc;
        }
        .auth-banner img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.9;
        }
        .auth-banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 64px;
        }

        .auth-form-section {
          width: 100%; display: flex; flex-direction: column; justify-content: center;
          padding: 32px 24px; position: relative;
        }
        .auth-form-container {
          max-width: 440px; width: 100%; margin: 0 auto;
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .input-group { position: relative; margin-bottom: 24px; }
        .input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none; transition: color 0.2s;
        }
        .premium-input {
          width: 100%; padding: 16px 16px 16px 48px;
          background: #f8fafc; border: 2px solid transparent; border-radius: 16px;
          font-size: 1rem; color: #0f172a; font-weight: 500;
          transition: all 0.2s ease;
        }
        .premium-input:focus {
          background: #ffffff; border-color: var(--primary); box-shadow: 0 4px 20px rgba(218, 41, 28, 0.1);
          outline: none;
        }
        .premium-input:focus + .input-icon { color: var(--primary); }
        
        .premium-btn {
          width: 100%; padding: 18px; border-radius: 16px; border: none;
          background: var(--primary); color: white; font-size: 1.1rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px rgba(218, 41, 28, 0.25);
        }
        .premium-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(218, 41, 28, 0.35); }
        .premium-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

        @media (min-width: 1024px) {
          .auth-banner { display: block; }
          .auth-form-section { width: 50%; padding: 64px; }
        }
      `}</style>

      {/* LEFT: Cinematic Banner */}
      <div className="auth-banner">
        <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80" alt="Wood-fired pizza" />
        <div className="auth-banner-overlay">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '16px' }}>
            <PizzaIcon /> <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>PIZZA CRAFT</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Section */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          
          <div className="mobile-only" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
            <PizzaIcon /> <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>PIZZA CRAFT</span>
          </div>

          {message ? (
            <div style={{ textAlign: 'center', animation: 'slideUpFade 0.6s forwards' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <SendIcon />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>Link Sent!</h1>
              <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '32px', lineHeight: '1.6' }}>
                {message}
              </p>
              <Link to="/login" className="premium-btn" style={{ display: 'block', textDecoration: 'none', background: '#0f172a', color: 'white', boxShadow: 'none' }}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Reset Password</h1>
              <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '32px' }}>Enter your email to receive a recovery link.</p>

              {error && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '24px', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Account Email"
                    className="premium-input"
                    required
                  />
                  <div className="input-icon"><MailIcon /></div>
                </div>

                <button type="submit" disabled={loading} className="premium-btn">
                  {loading ? 'Sending Request...' : 'Send Reset Link'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '32px', color: '#64748b', fontSize: '0.95rem' }}>
                Remember your password? <Link to="/login" style={{ fontWeight: '800', color: '#0f172a', textDecoration: 'none' }}>Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}