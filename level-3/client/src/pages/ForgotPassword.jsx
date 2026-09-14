import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MailIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

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
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-64) var(--space-16)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Reset Password</h1>
          <p className="text-body-sm text-secondary">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {message ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
            <div style={{ color: 'var(--success)', marginBottom: 'var(--space-16)', display: 'flex', justifyContent: 'center' }}>
              <MailIcon />
            </div>
            <h4 className="text-h4" style={{ marginBottom: 'var(--space-8)' }}>Check your email</h4>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
              {message} (In development mode, check your server terminal).
            </p>
            <Link to="/login" className="btn btn-outline btn-block">Return to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Account Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: 'var(--space-24)' }}>
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!message && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-32)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-24)' }}>
            <p className="text-body-sm text-secondary">
              Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}