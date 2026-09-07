import React from 'react';

export function SkeletonCard() {
  return (
    <div className="card" style={{ pointerEvents: 'none', padding: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .skeleton-shimmer {
          background: var(--border-light);
          animation: shimmer 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="skeleton-shimmer" style={{ height: '22px', width: '100%' }} />
      <div style={{ padding: 'var(--space-24)' }}>
        <div className="skeleton-shimmer" style={{ height: '24px', width: '70%', marginBottom: 'var(--space-12)' }} />
        <div className="skeleton-shimmer" style={{ height: '16px', width: '100%', marginBottom: 'var(--space-8)' }} />
        <div className="skeleton-shimmer" style={{ height: '16px', width: '40%', marginBottom: 'var(--space-24)' }} />
        <div className="skeleton-shimmer" style={{ height: '40px', width: '100%', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}