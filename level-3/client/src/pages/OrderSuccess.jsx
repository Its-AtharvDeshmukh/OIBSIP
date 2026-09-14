import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AnimatedCheck = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-24)' }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeDasharray="60" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" from="60" to="0" dur="0.8s" fill="freeze" />
    </path>
    <polyline points="22 4 12 14.01 9 11.01" strokeDasharray="30" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" from="30" to="0" dur="0.6s" begin="0.4s" fill="freeze" />
    </polyline>
  </svg>
);

export default function OrderSuccess() {
  const { orderId } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-80) var(--space-16)' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '480px', width: '100%', padding: 'var(--space-48) var(--space-32)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnimatedCheck />
        </div>
        
        <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Order Confirmed!</h1>
        <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-32)' }}>
          Your payment was successful and the kitchen has received your order. We're firing up the oven right now.
        </p>

        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-32)' }}>
          <p className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)' }}>Order ID</p>
          <p className="text-body" style={{ fontWeight: '600', fontFamily: 'monospace' }}>#{orderId}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <Link to={`/track/${orderId}`} className="btn btn-primary btn-block" style={{ padding: 'var(--space-16)' }}>
            Track Live Status
          </Link>
          <Link to="/" className="btn btn-outline btn-block">
            Return to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}