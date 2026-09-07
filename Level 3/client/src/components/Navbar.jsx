import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Premium Inline SVGs (Zero-Dependency) ---
const PizzaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const UserChevronIcon = ({ isOpen }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function Navbar() {
  const { user, logoutUser, admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Sticky scroll shadow detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers and dropdowns on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location.pathname]);

  // Handle click outside to close account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Body scroll lock on mobile drawer open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
        .navbar-shell {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          background-color: rgba(253, 251, 247, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          transition: background-color var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
        }
        .navbar-shell.scrolled {
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: var(--shadow-sm);
          border-color: var(--border);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          text-decoration: none;
        }
        .nav-brand-text {
          font-family: var(--font-serif);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }
        .nav-links-center {
          display: none;
        }
        .nav-link-item {
          position: relative;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
          padding: var(--space-8) 0;
          transition: color var(--transition-fast);
        }
        .nav-link-item:hover {
          color: var(--primary);
        }
        .nav-link-item.active {
          color: var(--primary);
        }
        /* Active Route Indicator Underline Pill */
        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--primary);
          border-radius: var(--radius-pill);
        }

        /* Right Actions Desktop */
        .nav-actions-right {
          display: none;
          align-items: center;
          gap: var(--space-20);
        }

        /* Account Dropdown Container */
        .account-dropdown-wrapper {
          position: relative;
        }
        .account-trigger-btn {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          padding: var(--space-8) var(--space-12);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-main);
          cursor: pointer;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .account-trigger-btn:hover {
          background: var(--surface);
          border-color: var(--border);
        }
        .account-menu-card {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: var(--space-8);
          z-index: var(--z-dropdown);
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: opacity var(--transition-fast), transform var(--transition-fast);
        }
        .account-menu-card.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .account-menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          padding: var(--space-12) var(--space-16);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
          transition: background var(--transition-fast);
          width: 100%;
          text-align: left;
        }
        .account-menu-item:hover {
          background: var(--bg-secondary);
          color: var(--primary);
        }
        .account-menu-divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-8) 0;
        }

        /* Mobile Controls */
        .nav-mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--text-main);
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.45);
          backdrop-filter: blur(3px);
          z-index: calc(var(--z-modal) - 1);
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-normal);
        }
        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 340px;
          height: 100vh;
          background-color: var(--surface);
          z-index: var(--z-modal);
          box-shadow: var(--shadow-lg);
          transform: translateX(100%);
          transition: transform var(--transition-slow);
          display: flex;
          flex-direction: column;
        }
        .mobile-drawer.open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-24);
          height: 76px;
          border-bottom: 1px solid var(--border-light);
        }
        .drawer-body {
          padding: var(--space-24);
          display: flex;
          flex-direction: column;
          gap: var(--space-32);
          overflow-y: auto;
          flex-grow: 1;
        }
        .drawer-nav-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-12);
        }
        .drawer-link {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          padding: var(--space-8) 0;
        }
        .drawer-link.active {
          color: var(--primary);
        }

        /* Desktop Viewport Queries */
        @media (min-width: 1024px) {
          .nav-links-center {
            display: flex;
            align-items: center;
            gap: var(--space-32);
          }
          .nav-actions-right {
            display: flex;
          }
          .nav-mobile-toggle, .mobile-overlay, .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>

      <header className={`navbar-shell ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          
          {/* Brand / Logo */}
          <Link to="/" className="nav-brand" aria-label="Pizza Craft Home">
            <PizzaIcon />
            <span className="nav-brand-text">PIZZA CRAFT</span>
          </Link>

          {/* Desktop Central Navigation Links */}
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
            <Link to="/builder" className="btn btn-primary btn-sm" style={{ padding: '10px 20px' }}>
              Build Pizza
            </Link>

            {user ? (
              <div className="account-dropdown-wrapper" ref={dropdownRef}>
                <button 
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="account-trigger-btn"
                  aria-expanded={isAccountDropdownOpen}
                  aria-haspopup="true"
                >
                  <span style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-soft)', 
                    color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' 
                  }}>
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                  <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  <UserChevronIcon isOpen={isAccountDropdownOpen} />
                </button>

                {/* Account Dropdown Card */}
                <div className={`account-menu-card ${isAccountDropdownOpen ? 'open' : ''}`}>
                  <div style={{ padding: 'var(--space-12) var(--space-16)', borderBottom: '1px solid var(--border-light)' }}>
                    <p className="text-body-sm" style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</p>
                    <p className="text-caption" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</p>
                  </div>
                  
                  <div style={{ padding: 'var(--space-4) 0' }}>
                    <Link to="/account" className="account-menu-item">
                      Profile Settings
                    </Link>
                    <Link to="/orders" className="account-menu-item">
                      Order History
                    </Link>
                  </div>

                  {admin && (
                    <>
                      <div className="account-menu-divider" />
                      <Link to="/admin/dashboard" className="account-menu-item" style={{ color: 'var(--primary)' }}>
                        Admin Console
                      </Link>
                    </>
                  )}

                  <div className="account-menu-divider" />
                  
                  <button onClick={handleUserLogout} className="account-menu-item" style={{ color: 'var(--danger)', width: '100%' }}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                <Link to="/login" className="nav-link-item" style={{ fontWeight: '600' }}>Sign In</Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="nav-mobile-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Over Drawer */}
      <aside className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation Drawer">
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
          <nav className="drawer-nav-group" aria-label="Mobile Menu Links">
            <Link to="/" className={`drawer-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/builder" className={`drawer-link ${isActive('/builder') ? 'active' : ''}`}>Custom Studio</Link>
            {user && (
              <Link to="/orders" className={`drawer-link ${isActive('/orders') ? 'active' : ''}`}>My Orders</Link>
            )}
          </nav>

          <div style={{ height: '1px', background: 'var(--border-light)' }} />

          <div className="drawer-nav-group">
            {user ? (
              <>
                <div style={{ padding: 'var(--space-12)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-8)' }}>
                  <p className="text-body-sm" style={{ fontWeight: '600' }}>{user.name}</p>
                  <p className="text-caption">{user.email}</p>
                </div>
                <Link to="/account" className="drawer-link" style={{ fontSize: '1rem' }}>Account Profile</Link>
                <button onClick={handleUserLogout} className="btn btn-outline btn-block" style={{ marginTop: 'var(--space-12)' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                <Link to="/login" className="btn btn-outline btn-block">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-block">Create Account</Link>
              </div>
            )}
          </div>

          {admin && (
            <>
              <div style={{ height: '1px', background: 'var(--border-light)' }} />
              <div className="drawer-nav-group">
                <span className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '700' }}>Operations</span>
                <Link to="/admin/dashboard" className="drawer-link" style={{ fontSize: '1rem', color: 'var(--primary)' }}>Admin Console</Link>
                <button onClick={handleAdminLogout} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', color: 'var(--danger)' }}>Exit Admin</button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}