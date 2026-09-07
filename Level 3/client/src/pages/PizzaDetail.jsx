import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"></path>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

export default function PizzaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setSelectedBase, setSelectedSauce, setSelectedCheese, setSelectedVeggies, ingredients, setCurrentStep } = usePizzaBuilder();

  useEffect(() => {
    const fetchPizzaDetail = async () => {
      try {
        const { data } = await API.get(`/pizzas`);
        const list = Array.isArray(data) ? data : (data.data || []);
        const found = list.find(p => p._id === id);
        if (found) {
          setPizza(found);
        } else {
          setError('Pizza recipe not found in our catalog.');
        }
      } catch (err) {
        setError('Failed to connect to the kitchen server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPizzaDetail();
  }, [id]);

  const handleCustomize = () => {
    if (!pizza) return;
    const config = pizza.defaultConfig || {};

    const matchedBase = ingredients.bases?.find(
      (b) => b.name?.toLowerCase().trim() === config.base?.toLowerCase().trim() || b._id === config.base
    ) || ingredients.bases?.[0] || null;

    const matchedSauce = ingredients.sauces?.find(
      (s) => s.name?.toLowerCase().trim() === config.sauce?.toLowerCase().trim() || s._id === config.sauce
    ) || ingredients.sauces?.[0] || null;

    const matchedCheese = ingredients.cheeses?.find(
      (c) => c.name?.toLowerCase().trim() === config.cheese?.toLowerCase().trim() || c._id === config.cheese
    ) || ingredients.cheeses?.[0] || null;

    const vegNames = Array.isArray(config.veggies) ? config.veggies : [];
    const matchedVeggies = vegNames.map((vegName) => 
      ingredients.veggies?.find((v) => v.name?.toLowerCase().trim() === vegName?.toLowerCase().trim() || v._id === vegName)
    ).filter(Boolean);

    setSelectedBase(matchedBase);
    setSelectedSauce(matchedSauce);
    setSelectedCheese(matchedCheese);
    setSelectedVeggies(matchedVeggies);
    setCurrentStep(1);
    navigate('/builder');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-80) 0', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-body text-secondary">Preparing recipe inspection...</p>
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="container" style={{ padding: 'var(--space-80) 0', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '440px', margin: '0 auto' }}>{error || 'Recipe not found'}</div>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 'var(--space-24)' }}>Return to Menu Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-32) var(--space-16) var(--space-80) var(--space-16)' }}>
      <style>{`
        .pizza-detail-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-40);
          align-items: start;
          margin-top: var(--space-24);
        }
        .pizza-image-panel {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--bg-secondary);
          box-shadow: var(--shadow-md);
        }
        .pizza-image-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .pizza-image-panel:hover img {
          transform: scale(1.03);
        }
        .blueprint-card {
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-24);
          margin: var(--space-24) 0;
          box-shadow: var(--shadow-sm);
        }
        .blueprint-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-12) 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .blueprint-row:last-child {
          border-bottom: none;
        }
        @media (min-width: 1024px) {
          .pizza-detail-wrapper {
            grid-template-columns: 1fr 1.1fr;
            gap: var(--space-64);
          }
          .pizza-image-panel {
            height: 540px;
            position: sticky;
            top: 100px;
          }
        }
      `}</style>

      <Link 
        to="/" 
        className="text-body-sm text-secondary" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)', fontWeight: '600', transition: 'color var(--transition-fast)' }}
      >
        <ArrowLeftIcon /> Back to Menu Catalog
      </Link>

      <div className="pizza-detail-wrapper">
        
        <div className="pizza-image-panel">
          <img 
            src={pizza.image} 
            alt={pizza.name} 
            onError={(e) => { 
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'var(--border-light)';
            }}
          />
          <div style={{ position: 'absolute', top: 'var(--space-16)', left: 'var(--space-16)' }}>
            <span className="badge badge-primary" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-sm)' }}>
              <SparkleIcon /> Signature Chef Creation
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-display" style={{ marginBottom: 'var(--space-12)' }}>{pizza.name}</h1>
          <p className="text-body-lg text-secondary" style={{ marginBottom: 'var(--space-24)', lineHeight: '1.6' }}>
            {pizza.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border-light)', padding: 'var(--space-20) var(--space-24)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-24)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <span className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Total Price</span>
              <span className="text-price" style={{ fontSize: '2rem', color: 'var(--primary)' }}>{formatPrice(pizza.price)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', background: 'var(--success-soft)', padding: 'var(--space-8) var(--space-12)', borderRadius: 'var(--radius-pill)', color: 'var(--success)' }}>
              <ShieldCheckIcon />
              <span className="text-body-sm" style={{ fontWeight: '700' }}>Freshly Baked</span>
            </div>
          </div>

          <div className="blueprint-card">
            <h3 className="text-h4" style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border-light)' }}>
              Recipe Blueprint
            </h3>

            <div className="blueprint-row">
              <span className="text-body-sm text-secondary" style={{ fontWeight: '600' }}>Dough Base</span>
              <span className="text-body-sm" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{pizza.defaultConfig?.base || 'Classic Hand Tossed'}</span>
            </div>
            <div className="blueprint-row">
              <span className="text-body-sm text-secondary" style={{ fontWeight: '600' }}>Signature Sauce</span>
              <span className="text-body-sm" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{pizza.defaultConfig?.sauce || 'Marinara'}</span>
            </div>
            <div className="blueprint-row">
              <span className="text-body-sm text-secondary" style={{ fontWeight: '600' }}>Cheese Blend</span>
              <span className="text-body-sm" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{pizza.defaultConfig?.cheese || 'Fresh Mozzarella'}</span>
            </div>
            <div className="blueprint-row">
              <span className="text-body-sm text-secondary" style={{ fontWeight: '600' }}>Farm Vegetables</span>
              <span className="text-body-sm" style={{ fontWeight: '700', color: 'var(--text-main)', textAlign: 'right', maxWidth: '65%' }}>
                {pizza.defaultConfig?.veggies && pizza.defaultConfig.veggies.length > 0 
                  ? pizza.defaultConfig.veggies.join(', ') 
                  : 'None selected'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginTop: 'var(--space-32)' }}>
            <button 
              onClick={handleCustomize} 
              className="btn btn-primary btn-block" 
              style={{ padding: 'var(--space-16)', fontSize: '1.05rem', fontWeight: '700', boxShadow: 'var(--shadow-md)' }}
            >
              Customize & Configure Recipe →
            </button>
            <Link to="/" className="btn btn-outline btn-block">
              Back to Catalog
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}