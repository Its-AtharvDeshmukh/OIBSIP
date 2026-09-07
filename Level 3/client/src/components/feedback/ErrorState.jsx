import React from 'react';

export default function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while communicating with the kitchen server.', 
  onRetry 
}) {
  return (
    <div className="alert alert-danger" style={{ 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      padding: 'var(--space-24)', 
      maxWidth: '600px', 
      margin: 'var(--space-32) auto',
      gap: 'var(--space-12)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        <span style={{ fontSize: '1.25rem' }} aria-hidden="true">⚠️</span>
        <h4 className="text-h4" style={{ margin: 0, color: 'var(--danger)' }}>{title}</h4>
      </div>
      <p className="text-body-sm" style={{ color: 'var(--danger)', opacity: 0.9 }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-8)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          Try Again
        </button>
      )}
    </div>
  );
}