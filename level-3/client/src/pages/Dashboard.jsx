import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

// --- Premium UI Icons ---
const FlameIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>;
const LeafIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const HistoryIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline></svg>;
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"></path></svg>;

const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

export default function Dashboard() {
  const [pizzas, setPizzas] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setSelectedBase, setSelectedSauce, setSelectedCheese, setSelectedVeggies, ingredients, setCurrentStep } = usePizzaBuilder();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const pizzaRes = await API.get('/pizzas');
        const fetchedArray = Array.isArray(pizzaRes.data) ? pizzaRes.data : (pizzaRes.data.data || []);
        
        // Exclude soft-deleted items from the customer view
        const activeMenu = fetchedArray.filter(p => !p.isDeleted);
        setPizzas(activeMenu);

        if (isAuthenticated) {
          try {
            const orderRes = await API.get('/orders/my-orders');
            const orderArray = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.data || []);
            setRecentOrders(orderArray.slice(0, 2));
          } catch (ordErr) {
            console.error('Could not fetch user orders', ordErr);
          }
        }
      } catch (err) {
        setError('Failed to load the menu. Please check your connection.');
      } finally {
        setTimeout(() => setLoading(false), 600); // Allow animation to play briefly
      }
    };
    fetchDashboardData();
  }, [isAuthenticated]);

  // Handle clicking the entire card
  const handleCardClick = (pizzaId) => {
    navigate(`/pizza/${pizzaId}`);
  };

  // Safe context extraction with event propagation stopped
  const handleCustomizePreconfig = (e, pizza) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (!pizza) return;
    if (!ingredients || !ingredients.bases || ingredients.bases.length === 0) {
      navigate('/builder');
      return;
    }
    
    const config = pizza.defaultConfig || {};
    
    const matchedBase = ingredients.bases.find((b) => b.name === config.base) || ingredients.bases[0];
    const matchedSauce = ingredients.sauces.find((s) => s.name === config.sauce) || ingredients.sauces[0];
    const matchedCheese = ingredients.cheeses.find((c) => c.name === config.cheese) || ingredients.cheeses[0];
    
    const vegNames = Array.isArray(config.veggies) ? config.veggies : [];
    const matchedVeggies = vegNames
      .map((vegName) => ingredients.veggies.find((v) => v.name === vegName))
      .filter(Boolean);

    setSelectedBase(matchedBase);
    setSelectedSauce(matchedSauce);
    setSelectedCheese(matchedCheese);
    setSelectedVeggies(matchedVeggies);
    
    setCurrentStep(1);
    navigate('/builder');
  };

  // Smart Filtering Logic
  const filteredPizzas = useMemo(() => {
    if (activeFilter === 'All') return pizzas;
    if (activeFilter === 'Veg') return pizzas.filter(p => !p.name.toLowerCase().match(/chicken|meat|beef|pork/));
    if (activeFilter === 'Spicy') return pizzas.filter(p => p.name.toLowerCase().match(/spicy|fiery|jalapeño|pepper/));
    if (activeFilter === 'Bestsellers') return pizzas.slice(0, 3);
    return pizzas;
  }, [pizzas, activeFilter]);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 'var(--space-80)' }}>
      <style>{`
        .app-container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-16); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* --- Warm Appetizing Hero Banner --- */
        .promo-banner {
          background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); /* Warm Cream/Dough gradient */
          border-radius: 32px;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-24);
          margin-bottom: var(--space-48);
          box-shadow: 0 20px 40px rgba(218, 41, 28, 0.08);
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        .hero-background-glow {
          position: absolute;
          top: 50%;
          right: 10%;
          transform: translateY(-50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 60%);
          border-radius: 50%;
          z-index: 1;
        }
        .promo-content {
          position: relative;
          z-index: 3;
          max-width: 540px;
        }
        .promo-title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          color: #1F2937; /* Explicit Dark Charcoal so it never disappears */
        }
        /* --- The Plate Effect for Pizza --- */
        .promo-pizza-wrapper {
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 450px;
          height: 450px;
          z-index: 2;
          animation: floatHero 8s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .promo-pizza-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          /* Thick white border acts like a pizza plate */
          border: 14px solid #ffffff; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.15), inset 0 0 20px rgba(0,0,0,0.1);
        }
        @keyframes floatHero {
          0% { transform: translateY(-50%) rotate(0deg); }
          50% { transform: translateY(-55%) rotate(4deg); }
          100% { transform: translateY(-50%) rotate(0deg); }
        }
        /* --- Horizontal Categories --- */
        .category-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 16px;
          margin-bottom: 24px;
          scrollbar-width: none;
        }
        .category-scroll::-webkit-scrollbar { display: none; }
        .filter-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: 99px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .filter-chip:hover {
          border-color: var(--border);
          transform: translateY(-2px);
        }
        .filter-chip.active {
          background: var(--text-main);
          color: var(--surface);
          border-color: var(--text-main);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        /* --- Food Card Grid --- */
        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px 24px;
        }
        .food-card {
          background: var(--surface);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0,0,0,0.04);
          position: relative;
          cursor: pointer;
        }
        .food-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .food-image-box {
          height: 200px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .food-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .food-card:hover .food-image-box img {
          transform: scale(1.08);
        }
        .food-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 200px);
        }
        .food-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .food-desc {
          color: var(--text-secondary);
          font-size: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .food-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px dashed var(--border-light);
        }
        .food-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .add-btn {
          background: var(--primary-soft);
          color: var(--primary);
          font-weight: 800;
          font-size: 0.9rem;
          padding: 8px 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }
        .add-btn:hover {
          background: var(--primary);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(218, 41, 28, 0.25);
        }
        /* --- CSS Pizza Loader --- */
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }
        .css-pizza {
          width: 80px;
          height: 80px;
          background: #f59e0b;
          border-radius: 50%;
          position: relative;
          border: 6px solid #d97706;
          animation: spin 2s linear infinite;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .css-pizza::before {
          content: '';
          position: absolute;
          inset: 6px;
          background: #fef08a;
          border-radius: 50%;
        }
        .pep { position: absolute; width: 14px; height: 14px; background: #dc2626; border-radius: 50%; }
        .p1 { top: 15px; left: 20px; } .p2 { top: 35px; right: 15px; } .p3 { bottom: 15px; left: 30px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .promo-banner { padding: 40px 24px; text-align: center; justify-content: center; }
          .promo-pizza-wrapper { position: relative; right: auto; top: auto; width: 260px; height: 260px; margin: 0 auto 32px auto; transform: translateY(0); animation: float 6s ease-in-out infinite; }
          .promo-content { max-width: 100%; z-index: 3; }
        }
      `}</style>

      <div className="app-container">
        
        {/* --- DYNAMIC HERO PROMO --- */}
        <div className="promo-banner">
          <div className="hero-background-glow"></div>
          
          <div className="promo-content">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '24px', boxShadow: '0 4px 10px rgba(218, 41, 28, 0.3)' }}>
              <SparkleIcon /> PREMIUM DELIVERY IN 30 MINS
            </span>
            
            <h1 className="promo-title">
              It's not just a pizza.<br />
              <span style={{ color: 'var(--primary)' }}>It's an experience.</span>
            </h1>
            
            <p style={{ fontSize: '1.15rem', color: '#4B5563', marginBottom: '32px', lineHeight: '1.6', fontWeight: '500' }}>
              Hand-tossed dough, signature sauces, and fresh toppings. Order from our curated menu or build your own masterpiece.
            </p>
            
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/builder'); }}
              style={{ background: 'var(--text-main)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '99px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Enter The Studio
            </button>
          </div>
          
          {/* Pizza enclosed in a "Plate" border to fix cropping issues */}
          <div className="promo-pizza-wrapper desktop-only">
            <img 
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" 
              alt="Premium Fresh Pizza"
            />
          </div>
        </div>

        {/* --- RECENT ORDERS STRIP --- */}
        {isAuthenticated && recentOrders.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HistoryIcon /> Order It Again
              </h3>
              <Link to="/orders" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {recentOrders.map(ord => (
                <div key={ord._id} style={{ minWidth: '280px', background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Order #{ord._id.slice(-5).toUpperCase()}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ord.orderStatus}</p>
                  </div>
                  <Link to={`/track/${ord._id}`} style={{ background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Track
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger" style={{ marginBottom: '24px' }}>{error}</div>}

        {/* --- CSS LOADER --- */}
        {loading ? (
          <div className="loader-container">
            <div className="css-pizza">
              <div className="pep p1"></div>
              <div className="pep p2"></div>
              <div className="pep p3"></div>
            </div>
            <p style={{ marginTop: '24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Warming up the ovens...</p>
          </div>
        ) : (
          <>
            {/* --- SMART FILTERS --- */}
            <div className="category-scroll">
              {['All', 'Bestsellers', 'Veg', 'Spicy'].map(filter => {
                let Icon = null;
                if (filter === 'Bestsellers') Icon = StarIcon;
                if (filter === 'Veg') Icon = LeafIcon;
                if (filter === 'Spicy') Icon = FlameIcon;
                
                return (
                  <button 
                    key={filter}
                    className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {Icon && <span style={{ color: activeFilter === filter ? '#fef08a' : (filter==='Veg'?'var(--success)':'#ef4444') }}><Icon /></span>}
                    {filter}
                  </button>
                )
              })}
            </div>

            {/* --- CLICKABLE FOOD GRID --- */}
            <div className="food-grid">
              {filteredPizzas.map((pizza, index) => (
                <div 
                  key={pizza._id} 
                  className="food-card" 
                  onClick={() => handleCardClick(pizza._id)}
                  style={{ animation: `fadeUp 0.5s ease backwards ${index * 0.1}s` }}
                >
                  <div className="food-image-box">
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ClockIcon /> 25 mins
                    </div>
                  </div>
                  
                  <div className="food-details">
                    <h3 className="food-title">{pizza.name}</h3>
                    <p className="food-desc">{pizza.description}</p>
                    
                    <div className="food-footer">
                      <span className="food-price">{formatPrice(pizza.price)}</span>
                      <button 
                        onClick={(e) => handleCustomizePreconfig(e, pizza)} 
                        className="add-btn"
                        disabled={!pizza.isAvailable}
                        aria-label={`Customize ${pizza.name}`}
                      >
                        {pizza.isAvailable ? 'CUSTOMIZE' : 'UNAVAILABLE'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPizzas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                <p style={{ fontSize: '3rem', margin: '0' }}>🍕</p>
                <h3 style={{ fontSize: '1.25rem', marginTop: '16px' }}>No pizzas found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try selecting a different category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}