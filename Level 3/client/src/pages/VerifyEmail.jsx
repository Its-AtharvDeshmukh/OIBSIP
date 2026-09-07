import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const LoaderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-64) var(--space-16)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: 'var(--space-48) var(--space-24)' }}>
        
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 'var(--space-24)' }}><LoaderIcon /></div>
            <h1 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>Verifying Email...</h1>
            <p className="text-body-sm text-secondary">Please wait while we securely confirm your credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 'var(--space-24)' }}><CheckCircleIcon /></div>
            <h1 className="text-h3" style={{ color: 'var(--success)', marginBottom: 'var(--space-8)' }}>Email Verified!</h1>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-32)' }}>{message}</p>
            <Link to="/login" className="btn btn-primary btn-block">Proceed to Sign In</Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 'var(--space-24)' }}><XCircleIcon /></div>
            <h1 className="text-h3" style={{ color: 'var(--danger)', marginBottom: 'var(--space-8)' }}>Verification Failed</h1>
            <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-32)' }}>{message}</p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              <Link to="/register" className="btn btn-primary btn-block">Create New Account</Link>
              <Link to="/login" className="btn btn-outline btn-block">Back to Sign In</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}