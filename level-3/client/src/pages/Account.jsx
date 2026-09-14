import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Premium UI Icons ---
const HistoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5"></path>
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
    <polyline points="12 7 12 12 15 15"></polyline>
  </svg>
);

const PizzaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/>
    <path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

export default function Account() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) return null;

  // Extract initials for the premium avatar
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 'var(--space-80)' }}>
      <style>{`
        /* --- Cinematic Animations --- */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .stagger-1 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.1s; }
        .stagger-2 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.2s; }
        .stagger-3 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-delay: 0.3s; }
        .scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

        /* --- Layout --- */
        .account-wrapper {
          max-width: 600px;
          margin: 0 auto;
          padding: 64px 20px;
        }

        /* --- Profile Header Card --- */
        .profile-hero {
          background: white;
          border-radius: 32px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          border: 1px solid var(--border-light);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle glowing background orb */
        .profile-hero::before {
          content: '';
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(218, 41, 28, 0.05) 0%, transparent 70%);
          z-index: 0;
        }

        .avatar-container {
          position: relative;
          z-index: 2;
          width: 96px;
          height: 96px;
          margin: 0 auto 24px auto;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #be123c 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          box-shadow: 0 12px 24px rgba(218, 41, 28, 0.3);
          border: 4px solid white;
        }

        .profile-name {
          position: relative;
          z-index: 2;
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .profile-email {
          position: relative;
          z-index: 2;
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .verified-badge {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #166534;
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* --- Interactive Action Menu --- */
        .action-menu {
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid var(--border-light);
          overflow: hidden;
        }

        .action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease;
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
        }

        .action-row:last-child {
          border-bottom: none;
        }

        .action-row:hover {
          background: #f8fafc;
        }

        .action-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-main);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .action-row:hover .action-icon-wrap {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .action-text {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .action-subtext {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .chevron {
          color: var(--text-muted);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .action-row:hover .chevron {
          transform: translateX(4px);
          color: var(--primary);
        }

        /* --- Destructive Action Specifics --- */
        .action-row.danger .action-icon-wrap {
          background: #fee2e2;
          color: #ef4444;
        }
        .action-row.danger .action-text {
          color: #ef4444;
        }
        .action-row.danger:hover {
          background: #fef2f2;
        }
        .action-row.danger:hover .chevron {
          color: #ef4444;
        }
      `}</style>

      <div className="account-wrapper">
        
        {/* Profile Hero Card */}
        <div className="profile-hero stagger-1">
          <div className="avatar-container scale-in">
            {initials}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="verified-badge">
            <ShieldCheckIcon /> Verified Customer
          </div>
        </div>

        <h3 className="stagger-2" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800', color: '#94a3b8', marginBottom: '16px', paddingLeft: '16px' }}>
          Account Actions
        </h3>

        {/* Apple-style Interactive List Group */}
        <div className="action-menu stagger-3">
          
          <Link to="/orders" className="action-row">
            <div className="action-content">
              <div className="action-icon-wrap">
                <HistoryIcon />
              </div>
              <div>
                <div className="action-text">View Order History</div>
                <div className="action-subtext">Track your live deliveries & past receipts</div>
              </div>
            </div>
            <div className="chevron"><ChevronRightIcon /></div>
          </Link>

          <Link to="/builder" className="action-row">
            <div className="action-content">
              <div className="action-icon-wrap" style={{ color: 'var(--primary)' }}>
                <PizzaIcon />
              </div>
              <div>
                <div className="action-text">Craft a New Pizza</div>
                <div className="action-subtext">Open the studio to build a masterpiece</div>
              </div>
            </div>
            <div className="chevron"><ChevronRightIcon /></div>
          </Link>

          <button onClick={handleLogout} className="action-row danger">
            <div className="action-content">
              <div className="action-icon-wrap">
                <LogoutIcon />
              </div>
              <div>
                <div className="action-text">Sign Out</div>
                <div className="action-subtext">Securely log out of your account</div>
              </div>
            </div>
            <div className="chevron"><ChevronRightIcon /></div>
          </button>

        </div>

      </div>
    </div>
  );
}