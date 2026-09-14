import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon = '🍕', 
  title = 'Nothing here yet', 
  description = 'Check back later or start a new order.', 
  actionText, 
  actionLink 
}) {
  return (
    <div className="card" style={{ 
      textAlign: 'center', 
      padding: 'var(--space-64) var(--space-24)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      maxWidth: '500px',
      margin: 'var(--space-32) auto'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>{title}</h3>
      <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-24)' }}>
        {description}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}