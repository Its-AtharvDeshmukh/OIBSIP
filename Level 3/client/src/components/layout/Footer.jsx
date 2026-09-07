import React from 'react';
import { Link } from 'react-router-dom';

const PizzaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/>
    <path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: 'var(--bg-secondary)', 
      borderTop: '1px solid var(--border-light)',
      padding: 'var(--space-64) 0 var(--space-32) 0',
      marginTop: 'auto'
    }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-40);
          margin-bottom: var(--space-48);
        }
        .footer-col h4 {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-main);
          margin-bottom: var(--space-16);
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-12);
        }
        .footer-links a {
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          border-top: 1px solid var(--border-light);
          padding-top: var(--space-24);
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
          align-items: center;
          text-align: center;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Bio */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: 'var(--space-16)' }}>
              <PizzaIcon />
              <span style={{ fontFamily: 'var(--font-serif)' }}>PIZZA CRAFT</span>
            </Link>
            <p className="text-body-sm text-secondary" style={{ maxWidth: '340px', lineHeight: '1.6' }}>
              Artisanal pizza, crafted to your exact specifications with hand-tossed dough and fresh daily ingredients, delivered piping hot.
            </p>
          </div>
          
          {/* Column 2: Explore Navigation */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Signature Menu</Link></li>
              <li><Link to="/builder">The Pizza Studio</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>

          {/* Column 3: Account & Operations */}
          <div className="footer-col">
            <h4>Customer Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/account">Profile Settings</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p className="text-caption">
            &copy; {currentYear} Pizza Craft. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-24)' }} className="text-caption">
            <Link to="/admin/login" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}