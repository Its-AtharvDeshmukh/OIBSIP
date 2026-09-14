import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Premium UI Icons ---
const PizzaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/>
    <path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const HistoryIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const DashboardIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;

export default function Navbar() {
  const { user, logoutUser, admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleUserLogout = () => {
    logoutUser();
    setIsAccountDropdownOpen(false);
    navigate('/login');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        /* --- GLOBAL FIX: Prevent content overlap under fixed navbar --- */
        body {
          padding-top: 105px !important;
        }

        /* --- Fully Transparent Floating Island Navbar --- */
        .navbar-shell {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 1240px;
          z-index: 1000;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 99px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar-shell.scrolled {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
          top: 12px;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          padding: 0 28px;
        }

        /* --- Brand --- */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .nav-brand:hover { transform: scale(1.02); }

        .nav-brand-text {
          font-family: var(--font-serif);
          font-weight: 800;
          font-size: 1.3rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        /* --- Desktop Center Links --- */
        .nav-links-center {
          display: none;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          padding: 6px;
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }

        .nav-link-item {
          position: relative;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9rem;
          color: #475569;
          padding: 8px 20px;
          border-radius: 99px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-link-item:hover { color: #0f172a; background: rgba(255,255,255,0.8); }
        .nav-link-item.active {
          color: white;
          background: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        /* --- Desktop Right Actions --- */
        .nav-actions-right {
          display: none;
          align-items: center;
          gap: 12px;
        }

        /* --- Profile Dropdown --- */
        .account-dropdown-wrapper { position: relative; }

        .account-trigger-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 16px 6px 6px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }

        .account-trigger-btn:hover { background: #ffffff; }

        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 800;
        }

        .account-menu-card {
          position: absolute; top: calc(100% + 12px); right: 0;
          width: 260px; background: white; border: 1px solid var(--border-light);
          border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          padding: 8px; z-index: 1001; opacity: 0;
          transform: translateY(-10px) scale(0.95); pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top right;
        }
        .account-menu-card.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

        .account-header-info { padding: 14px 16px; border-bottom: 1px solid var(--border-light); margin-bottom: 6px; }
        .account-menu-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-radius: 14px; font-size: 0.9rem; font-weight: 600; color: var(--text-main);
          transition: background 0.2s ease; width: 100%; text-align: left; cursor: pointer; text-decoration: none;
        }
        .account-menu-item:hover { background: #f8fafc; color: var(--primary); }

        /* --- Mobile Controls --- */
        .nav-mobile-toggle {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; color: #0f172a;
          background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 50%;
          cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .mobile-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(6px); z-index: 1005; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-overlay.open { opacity: 1; pointer-events: auto; }

        .mobile-drawer {
          position: fixed; top: 0; right: 0; width: 100%; max-width: 320px;
          height: 100vh; background-color: white; z-index: 1006;
          box-shadow: -20px 0 50px rgba(0,0,0,0.15);
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column; border-top-left-radius: 32px; border-bottom-left-radius: 32px;
        }
        .mobile-drawer.open { transform: translateX(0); }

        .drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 76px; border-bottom: 1px solid var(--border-light); }
        .drawer-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; flex-grow: 1; }
        .drawer-link { display: flex; align-items: center; gap: 12px; font-size: 1.05rem; font-weight: 700; color: var(--text-main); padding: 14px 18px; border-radius: 16px; transition: background 0.2s; text-decoration: none; }
        .drawer-link:hover, .drawer-link.active { background: #f8fafc; color: var(--primary); }

        @media (min-width: 1024px) {
          .nav-links-center { display: flex; align-items: center; }
          .nav-actions-right { display: flex; }
          .nav-mobile-toggle, .mobile-overlay, .mobile-drawer { display: none !important; }
        }
      `}</style>

      {/* Fully Transparent Floating Island Header Shell */}
      <header className={`navbar-shell ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          
          {/* Brand */}
          <Link to="/" className="nav-brand" aria-label="Pizza Craft Home">
            <PizzaIcon />
            <span className="nav-brand-text">PIZZA CRAFT</span>
          </Link>

          {/* Desktop Center Links */}
          <nav className="nav-links-center" aria-label="Main Navigation">
            <Link to="/" className={`nav-link-item ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/builder" className={`nav-link-item ${isActive('/builder') ? 'active' : ''}`}>
              Custom Studio
            </Link>
            {user && (
              <Link to="/orders" className={`nav-link-item ${isActive('/orders') ? 'active' : ''}`}>
                My Orders
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="nav-actions-right">
            <Link 
              to="/builder" 
              className="btn btn-primary" 
              style={{ padding: '10px 22px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800' }}
            >
              Build Pizza
            </Link>

            {user ? (
              <div className="account-dropdown-wrapper" ref={dropdownRef}>
                <button 
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="account-trigger-btn"
                  aria-expanded={isAccountDropdownOpen}
                >
                  <div className="user-avatar">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  <ChevronDownIcon isOpen={isAccountDropdownOpen} />
                </button>

                <div className={`account-menu-card ${isAccountDropdownOpen ? 'open' : ''}`}>
                  <div className="account-header-info">
                    <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>{user.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</p>
                  </div>
                  
                  <div>
                    <Link to="/account" className="account-menu-item">
                      <SettingsIcon /> Profile Settings
                    </Link>
                    <Link to="/orders" className="account-menu-item">
                      <HistoryIcon /> Order History
                    </Link>
                  </div>

                  {admin && (
                    <>
                      <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />
                      <div>
                        <Link to="/admin/dashboard" className="account-menu-item" style={{ color: 'var(--primary)' }}>
                          <DashboardIcon /> Admin Console
                        </Link>
                      </div>
                    </>
                  )}

                  <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />
                  
                  <div>
                    <button onClick={handleUserLogout} className="account-menu-item" style={{ color: '#ef4444' }}>
                      <LogoutIcon /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ padding: '10px 22px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)' }}>
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="nav-mobile-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Slide-Over Drawer */}
      <aside className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Link to="/" className="nav-brand" onClick={() => setIsMobileMenuOpen(false)}>
            <PizzaIcon />
            <span className="nav-brand-text">PIZZA CRAFT</span>
          </Link>
          <button 
            className="nav-mobile-toggle" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="drawer-body">
          {user ? (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="user-avatar" style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>{user.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.email}</p>
                </div>
              </div>
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline btn-block" style={{ borderRadius: '14px' }}>
                Manage Account
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary btn-block" style={{ borderRadius: '14px', padding: '14px' }}>Sign In</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline btn-block" style={{ borderRadius: '14px', padding: '14px' }}>Create Account</Link>
            </div>
          )}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`drawer-link ${isActive('/') ? 'active' : ''}`}>
              🏠 Home
            </Link>
            <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)} className={`drawer-link ${isActive('/builder') ? 'active' : ''}`}>
              🍕 Custom Studio
            </Link>
            {user && (
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className={`drawer-link ${isActive('/orders') ? 'active' : ''}`}>
                <HistoryIcon /> My Orders
              </Link>
            )}
          </nav>

          {admin && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'block' }}>Staff Options</span>
              <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link" style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                <DashboardIcon /> Admin Console
              </Link>
              <button onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }} className="btn btn-outline btn-block" style={{ color: '#ef4444', borderColor: '#fca5a5', borderRadius: '14px' }}>
                Exit Admin
              </button>
            </div>
          )}

          {user && !admin && (
            <div style={{ marginTop: 'auto' }}>
              <button onClick={handleUserLogout} className="btn btn-outline btn-block" style={{ color: '#ef4444', borderColor: '#fca5a5', borderRadius: '14px', padding: '14px' }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}