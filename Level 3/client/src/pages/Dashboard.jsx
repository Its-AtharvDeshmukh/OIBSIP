import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

// Safe currency formatter with tabular numerals
const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Icons
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"></path>
  </svg>
);

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline>
  </svg>
);

export default function Dashboard() {
  const [pizzas, setPizzas] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setSelectedBase, setSelectedSauce, setSelectedCheese, setSelectedVeggies, ingredients, setCurrentStep } = usePizzaBuilder();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const pizzaRes = await API.get('/pizzas');
        const pizzaArray = Array.isArray(pizzaRes.data) ? pizzaRes.data : (pizzaRes.data.data || []);
        setPizzas(pizzaArray);

        if (isAuthenticated) {
          try {
            const orderRes = await API.get('/orders');
            const orderArray = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.data || []);
            setRecentOrders(orderArray.slice(0, 2));
          } catch (ordErr) {
            console.error('Could not fetch user orders', ordErr);
          }
        }
      } catch (err) {
        setError('Failed to load Pizza Craft menu. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [isAuthenticated]);

  const handleCustomizePreconfig = (pizza) => {
    if (!ingredients.bases.length) {
      navigate('/builder');
      return;
    }
    
    const matchedBase = ingredients.bases.find((b) => b.name === pizza.defaultConfig?.base) || ingredients.bases[0];
    const matchedSauce = ingredients.sauces.find((s) => s.name === pizza.defaultConfig?.sauce) || ingredients.sauces[0];
    const matchedCheese = ingredients.cheeses.find((c) => c.name === pizza.defaultConfig?.cheese) || ingredients.cheeses[0];
    const matchedVeggies = (pizza.defaultConfig?.veggies || [])
      .map((vegName) => ingredients.veggies.find((v) => v.name === vegName))
      .filter(Boolean);

    setSelectedBase(matchedBase);
    setSelectedSauce(matchedSauce);
    setSelectedCheese(matchedCheese);
    setSelectedVeggies(matchedVeggies);
    setCurrentStep(1);
    navigate('/builder');
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-80)' }}>
      <style>{`
        /* Hero Styling */
        .dashboard-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-32);
          align-items: center;
          padding: var(--space-64) 0;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: var(--space-48);
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-16);
          margin-top: var(--space-32);
        }
        .hero-badge-group {
          display: inline-flex;
          align-items: center;
          gap: var(--space-8);
          background: var(--primary-soft);
          color: var(--primary);
          padding: var(--space-4) var(--space-16);
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-16);
        }
        .hero-visual {
          width: 100%;
          height: 320px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          background: linear-gradient(135deg, #111827 0%, #374151 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hero-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transition: transform var(--transition-slow);
        }
        .hero-visual:hover img {
          transform: scale(1.03);
        }

        /* Menu Catalog & Section Header */
        .menu-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          margin-bottom: var(--space-32);
          border-bottom: 1px solid var(--border-light);
          padding-bottom: var(--space-16);
        }
        .menu-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .pizza-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-32);
        }

        /* --- REDESIGNED PIZZA CARD SYSTEM --- */
        .pizza-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-fast);
        }
        .pizza-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--border);
        }
        .pizza-image-container {
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: var(--bg-secondary);
          position: relative;
        }
        .pizza-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .pizza-card:hover .pizza-image-container img {
          transform: scale(1.04);
        }
        .pizza-card-content {
          padding: var(--space-24);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .pizza-title-price {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--space-12);
          margin-bottom: var(--space-12);
        }
        .pizza-name {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }
        .pizza-name a:hover {
          color: var(--primary);
        }
        .pizza-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--space-20);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pizza-metadata {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-8);
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: var(--space-24);
          padding-top: var(--space-12);
          border-top: 1px dashed var(--border-light);
        }
        .pizza-tag {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .pizza-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--border-strong);
        }
        .pizza-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: var(--space-16);
          margin-top: auto;
        }

        /* Studio Callout Banner */
        .studio-banner {
          background: linear-gradient(135deg, var(--secondary) 0%, #111827 100%);
          color: var(--text-inverse);
          border-radius: var(--radius-xl);
          padding: var(--space-48);
          margin: var(--space-64) 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-24);
          position: relative;
          overflow: hidden;
        }
        .studio-banner h2 { color: var(--text-inverse); }

        /* Skeleton Loading */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton {
          background: var(--border-light);
          animation: pulse 1.5s infinite;
          border-radius: var(--radius-sm);
        }

        @media (min-width: 1024px) {
          .dashboard-hero {
            grid-template-columns: 1.2fr 1fr;
            padding: var(--space-80) 0;
          }
          .hero-visual {
            height: 420px;
          }
          .studio-banner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="dashboard-hero">
        <div>
          <div className="hero-badge-group">
            <SparkleIcon />
            <span>Artisanal Pizzeria & Custom Studio</span>
          </div>
          <h1 className="text-display" style={{ marginBottom: 'var(--space-16)' }}>
            Crafted with passion.<br/>Delivered piping hot.
          </h1>
          <p className="text-body-lg text-secondary" style={{ maxWidth: '520px' }}>
            Experience hand-tossed artisan recipes made with premium ingredients, or step into our studio to build your perfect pie from scratch.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate('/builder')} className="btn btn-primary" style={{ padding: 'var(--space-16) var(--space-32)' }}>
              Build Custom Pizza <ArrowRightIcon />
            </button>
            <a href="#menu-catalog" className="btn btn-outline" style={{ padding: 'var(--space-16) var(--space-24)' }}>
              Explore Menu
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80" 
            alt="Artisanal Pizza Craft"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </section>

      {/* --- RETURNING USER ACTIVITY STRIP --- */}
      {isAuthenticated && recentOrders.length > 0 && (
        <section style={{ marginBottom: 'var(--space-48)', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-24)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
              <HistoryIcon />
              <h2 className="text-h4" style={{ margin: 0 }}>Welcome back, {user?.name?.split(' ')[0]}! Recent Activity</h2>
            </div>
            <Link to="/orders" className="text-body-sm" style={{ color: 'var(--primary)', fontWeight: '600' }}>View All Orders →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-16)' }}>
            {recentOrders.map(ord => (
              <div key={ord._id} style={{ background: 'var(--bg-secondary)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className="text-caption" style={{ fontFamily: 'monospace' }}>#{ord._id.slice(-6).toUpperCase()}</p>
                  <span className={`badge ${ord.status?.toLowerCase().includes('delivery') ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '4px' }}>
                    {ord.status}
                  </span>
                </div>
                <Link to={`/track/${ord._id}`} className="btn btn-outline btn-sm">Track Live</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- MENU CATALOG SECTION --- */}
      <section id="menu-catalog" style={{ scrollMarginTop: '100px' }}>
        <div className="menu-header">
          <span className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', fontWeight: '700' }}>Chef Curated</span>
          <div className="menu-header-top">
            <h2 className="text-h1" style={{ margin: 0 }}>Signature Chef Specials</h2>
            {!loading && (
              <span className="text-body-sm text-secondary font-medium">
                {pizzas.length} Creations Available
              </span>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Loading Skeletons */}
        {loading && (
          <div className="pizza-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pizza-card" style={{ pointerEvents: 'none' }}>
                <div className="skeleton" style={{ height: '240px', width: '100%' }} />
                <div className="pizza-card-content">
                  <div className="skeleton" style={{ height: '28px', width: '80%', marginBottom: 'var(--space-12)' }} />
                  <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: 'var(--space-8)' }} />
                  <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: 'var(--space-24)' }} />
                  <div className="skeleton" style={{ height: '44px', width: '100%', borderRadius: 'var(--radius-md)', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Redesigned Pizza Cards Grid */}
        {!loading && !error && (
          <div className="pizza-grid">
            {pizzas.map((pizza) => (
              <article key={pizza._id} className="pizza-card">
                
                {/* 1. Immersive Image Container */}
                <div className="pizza-image-container">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'var(--border-light)';
                    }}
                  />
                </div>
                
                {/* 2. Structured Card Content */}
                <div className="pizza-card-content">
                  
                  {/* Unified Title & Price Header */}
                  <div className="pizza-title-price">
                    <h3 className="pizza-name">
                      <Link to={`/pizza/${pizza._id}`} style={{ transition: 'color var(--transition-fast)' }}>
                        {pizza.name}
                      </Link>
                    </h3>
                    <span className="text-price">{formatPrice(pizza.price)}</span>
                  </div>
                  
                  {/* Clamped Description */}
                  <p className="pizza-description">
                    {pizza.description}
                  </p>
                  
                  {/* Refined Characteristic Tags Metadata */}
                  <div className="pizza-metadata">
                    {pizza.defaultConfig?.base && (
                      <span className="pizza-tag">{pizza.defaultConfig.base}</span>
                    )}
                    {pizza.defaultConfig?.base && pizza.defaultConfig?.cheese && (
                      <span className="pizza-dot" aria-hidden="true" />
                    )}
                    {pizza.defaultConfig?.cheese && (
                      <span className="pizza-tag">{pizza.defaultConfig.cheese}</span>
                    )}
                  </div>
                  
                  {/* Asymmetric Actions (Primary Customize CTA + Clean Details Link) */}
                  <div className="pizza-actions">
                    <button 
                      onClick={() => handleCustomizePreconfig(pizza)} 
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                    >
                      Customize
                    </button>
                    <Link to={`/pizza/${pizza._id}`} className="text-body-sm" style={{ fontWeight: '600', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      Details →
                    </Link>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* --- THE PIZZA STUDIO BANNER --- */}
      <section className="studio-banner">
        <div style={{ maxWidth: '540px' }}>
          <span className="badge" style={{ background: 'rgba(218, 41, 28, 0.2)', color: '#FF6B6B', marginBottom: 'var(--space-12)' }}>
            Interactive Configurator
          </span>
          <h2 className="text-h1" style={{ marginBottom: 'var(--space-12)' }}>The Pizza Studio</h2>
          <p className="text-body text-secondary" style={{ color: '#D1D5DB' }}>
            Take total control of your pie. Choose your preferred dough base, signature sauce, artisanal cheese blend, and farm-fresh vegetable toppings across our 4-step studio.
          </p>
        </div>
        <div>
          <button onClick={() => navigate('/builder')} className="btn btn-primary" style={{ padding: 'var(--space-16) var(--space-32)', whiteSpace: 'nowrap' }}>
            Start Building Now <ArrowRightIcon />
          </button>
        </div>
      </section>
    </div>
  );
}