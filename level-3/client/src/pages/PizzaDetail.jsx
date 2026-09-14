import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const FlameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const VegMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="12" cy="12" r="5" fill="#16a34a" />
  </svg>
);

const NonVegMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <polygon points="12,7 17,17 7,17" fill="#dc2626" />
  </svg>
);

// A hand-drawn-feel pizza glyph used as the graceful fallback when a photo
// is missing or fails to load — never just a blank gray box.
const PizzaGlyph = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 20h20L12 2z" />
    <circle cx="12" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const DoughIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <path d="M9 9c0 1 1 1 1 2s-1 1-1 2 1 1 1 2" />
    <path d="M14 8c0 1 1 1 1 2s-1 1-1 2 1 1 1 2" />
  </svg>
);

const SauceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c2.5 3 5 5.8 5 9a5 5 0 0 1-10 0c0-3.2 2.5-6 5-9z" />
  </svg>
);

const CheeseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 15 12 4l9 11z" />
    <circle cx="10" cy="14" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="12" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const VeggieIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-4-2-7-6-7-11a5 5 0 0 1 9-3c2-2 5-2 7 0-1 6-4 12-9 14z" />
  </svg>
);

const LAYER_META = [
  { key: 'base', label: 'Dough Base', color: '#E8C48A', fallback: 'Classic Hand Tossed', Icon: DoughIcon },
  { key: 'sauce', label: 'Signature Sauce', color: '#C0392B', fallback: 'Classic Marinara', Icon: SauceIcon },
  { key: 'cheese', label: 'Artisan Cheese', color: '#DDBB3F', fallback: 'Fresh Mozzarella', Icon: CheeseIcon },
  { key: 'veggies', label: 'Fresh Toppings', color: '#4C8B5A', fallback: 'None selected', Icon: VeggieIcon },
];

export default function PizzaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customizing, setCustomizing] = useState(false);
  const [imgStatus, setImgStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [showStickyBar, setShowStickyBar] = useState(false);
  const priceRef = useRef(null);
  const imgRef = useRef(null);

  const { setSelectedBase, setSelectedSauce, setSelectedCheese, setSelectedVeggies, ingredients, setCurrentStep } = usePizzaBuilder();

  useEffect(() => {
    let cancelled = false;

    const fetchPizzaDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/pizzas`);
        const list = Array.isArray(data) ? data : (data.data || []);
        const found = list.find(p => p._id === id);
        if (!cancelled) {
          if (found) setPizza(found);
          else setError('Pizza recipe not found in our catalog.');
        }
      } catch (err) {
        if (!cancelled) setError('Failed to connect to the kitchen server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPizzaDetail();
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    setImgStatus('loading');
  }, [pizza?._id]);

  // Guard against the classic <img> race: if the browser already had this
  // image cached, it can finish loading before the onLoad handler is
  // attached, so the event never fires and the skeleton stays stuck on top
  // forever. Checking `.complete` after mount catches that case.
  useEffect(() => {
    if (!pizza?.image) return;
    const el = imgRef.current;
    if (el && el.complete) {
      setImgStatus(el.naturalWidth > 0 ? 'loaded' : 'error');
    }
  }, [pizza?.image, pizza?._id]);

  useEffect(() => {
    if (loading || !priceRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(priceRef.current);
    return () => observer.disconnect();
  }, [loading, pizza]);

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

    setCustomizing(true);
    window.setTimeout(() => navigate('/builder'), 450);
  };

  const sharedStyles = (
    <style>{`
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
      }
      @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes shimmer { 100% { transform: translateX(100%); } }
      @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes barSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes layerSlideIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes popIn { from { opacity: 0; transform: scale(0.85) rotate(-8deg); } to { opacity: 1; transform: scale(1) rotate(-6deg); } }

      .pd-page { padding: var(--space-24) var(--space-16) var(--space-64); max-width: 1280px; margin: 0 auto; }

      .pd-back-link { display: inline-flex; align-items: center; gap: var(--space-8); font-weight: 700; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-24); transition: color 0.2s ease, gap 0.2s ease; }
      .pd-back-link:hover { color: var(--primary); gap: var(--space-12); }

      .pd-layout { display: grid; grid-template-columns: 1fr; gap: var(--space-40); }

      /* ---------- Framed image card, not a stretched full-bleed banner ---------- */
      .pd-image-col { position: relative; }
      .pd-image-frame { position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: var(--radius-xl); overflow: hidden; background: var(--bg-secondary); box-shadow: var(--shadow-lg); border: 1px solid var(--border-light); }
      .pd-image-frame img { width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1); }
      .pd-image-frame img.is-loaded { opacity: 1; }
      .pd-image-frame:hover img.is-loaded { transform: scale(1.04); }
      .pd-image-skeleton { position: absolute; inset: 0; background: var(--border-light); overflow: hidden; transition: opacity 0.4s ease; }
      .pd-image-skeleton::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(100deg, transparent, rgba(255,255,255,0.6), transparent); animation: shimmer 1.6s infinite; }
      .pd-image-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-12); background: linear-gradient(150deg, var(--bg-secondary) 0%, var(--primary-soft) 150%); color: var(--border-strong); }
      .pd-image-fallback span { color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }

      .pd-price-tag { position: absolute; top: var(--space-20); right: -10px; background: var(--primary); color: #fff; padding: var(--space-12) var(--space-20); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); transform: rotate(-6deg); z-index: 6; opacity: 0; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s forwards; }
      .pd-price-tag-amount { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 800; line-height: 1; display: block; }
      .pd-price-tag-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.85; font-weight: 700; }

      .pd-diet-badge { position: absolute; bottom: var(--space-16); left: var(--space-16); z-index: 6; display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); box-shadow: var(--shadow-md); padding: 7px 14px; border-radius: var(--radius-pill); font-weight: 700; font-size: 0.78rem; color: var(--text-main); }

      .pd-signature-strip { display: inline-flex; align-items: center; gap: 6px; margin-top: var(--space-16); color: var(--primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; }

      /* ---------- Content column ---------- */
      .pd-title { font-family: var(--font-serif); font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 800; line-height: 1.08; color: var(--text-main); opacity: 0; animation: fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }

      .pd-info-strip { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-12); margin: var(--space-16) 0 var(--space-20); opacity: 0; animation: fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.18s forwards; }
      .pd-info-pill { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); background: var(--surface); border: 1px solid var(--border-light); padding: 6px 12px; border-radius: var(--radius-pill); }

      .pd-description { opacity: 0; animation: fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.26s forwards; }
      .pd-description::first-letter { font-family: var(--font-serif); font-size: 3rem; font-weight: 800; color: var(--primary); float: left; line-height: 0.8; margin: 5px 8px 0 0; }

      .pd-cta-row { display: flex; flex-direction: column; gap: var(--space-12); margin-top: var(--space-28); opacity: 0; animation: fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.34s forwards; }
      .pd-order-btn { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease, background-color 0.2s ease; }
      .pd-order-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
      .pd-order-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
      .pd-order-btn.is-going { background: var(--success); }
      .pd-order-btn .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

      /* ---------- Built in Layers: recipe timeline ---------- */
      .pd-stack-wrap { margin-top: var(--space-40); opacity: 0; animation: fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.42s forwards; }
      .pd-stack-heading-row { display: flex; align-items: center; gap: var(--space-12); margin-bottom: 4px; }
      .pd-stack-heading-icon { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--primary-soft); color: var(--primary); flex-shrink: 0; }

      .pd-timeline { position: relative; margin-top: var(--space-24); padding-left: 52px; }
      .pd-timeline-rail { position: absolute; left: 21px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(var(--border-light), var(--border-light)); background-image: repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 6px, transparent 6px, transparent 12px); }

      .pd-timeline-item { position: relative; margin-bottom: var(--space-20); opacity: 0; animation: layerSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
      .pd-timeline-item:last-child { margin-bottom: 0; }

      .pd-timeline-node { position: absolute; left: -52px; top: 0; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface); border: 2px solid var(--border-light); color: #fff; box-shadow: var(--shadow-sm); z-index: 2; transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .pd-timeline-item:hover .pd-timeline-node { transform: scale(1.08); box-shadow: var(--shadow-md); }
      .pd-timeline-step { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: var(--secondary); color: #fff; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); }

      .pd-timeline-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: var(--space-16) var(--space-20); transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
      .pd-timeline-item:hover .pd-timeline-card { transform: translateX(4px); box-shadow: var(--shadow-sm); border-color: var(--border); }
      .pd-timeline-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 2px; }
      .pd-timeline-value { font-size: 1rem; font-weight: 600; color: var(--text-main); line-height: 1.4; }

      .pd-sticky-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--z-fixed, 300); background: var(--surface); border-top: 1px solid var(--border-light); box-shadow: 0 -8px 24px rgba(0,0,0,0.08); padding: var(--space-12) var(--space-16); animation: barSlideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
      .pd-sticky-bar-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: var(--space-16); }
      .pd-sticky-price { display: flex; flex-direction: column; }

      .skeleton { position: relative; overflow: hidden; background: var(--border-light); border-radius: var(--radius-sm); }
      .skeleton::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); animation: shimmer 1.6s infinite; }

      @media (min-width: 900px) {
        .pd-layout { grid-template-columns: 1fr 1fr; align-items: start; gap: var(--space-64); }
        .pd-image-frame { aspect-ratio: 1 / 1; position: sticky; top: 100px; }
      }
    `}</style>
  );

  if (loading) {
    return (
      <div className="pd-page">
        {sharedStyles}
        <div className="skeleton" style={{ height: '20px', width: '160px', marginBottom: 'var(--space-24)' }} />
        <div className="pd-layout">
          <div className="skeleton" style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 'var(--radius-xl)' }} />
          <div>
            <div className="skeleton" style={{ height: '44px', width: '85%', marginBottom: 'var(--space-16)' }} />
            <div className="skeleton" style={{ height: '18px', width: '100%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '18px', width: '100%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: 'var(--space-32)' }} />
            <div className="skeleton" style={{ height: '56px', width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-32)' }} />
            <div className="skeleton" style={{ height: '68px', width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-12)' }} />
            <div className="skeleton" style={{ height: '68px', width: '100%', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="container" style={{ padding: 'var(--space-80) 0', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {sharedStyles}
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)', animation: 'gentleFloat 3s ease-in-out infinite' }} aria-hidden="true">🍕</div>
        <div className="alert alert-danger" style={{ maxWidth: '440px', margin: '0 auto' }} role="alert">
          <AlertIcon />
          <span>{error || 'Recipe not found'}</span>
        </div>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 'var(--space-24)' }}>Return to Menu Catalog</Link>
      </div>
    );
  }

  const isNonVeg = pizza.name.toLowerCase().includes('chicken') || pizza.name.toLowerCase().includes('meat') || pizza.name.toLowerCase().includes('pepperoni');

  return (
    <div className="pd-page">
      {sharedStyles}

      <Link to="/" className="pd-back-link">
        <ArrowLeftIcon /> Back to Menu Catalog
      </Link>

      <div className="pd-layout">
        {/* --- LEFT: FRAMED IMAGE CARD --- */}
        <div className="pd-image-col">
          <div className="pd-image-frame">
            {imgStatus !== 'error' && pizza.image && (
              <img
                ref={imgRef}
                src={pizza.image}
                alt={pizza.name}
                className={imgStatus === 'loaded' ? 'is-loaded' : ''}
                referrerPolicy="no-referrer"
                onLoad={(e) => setImgStatus(e.target.naturalWidth > 0 ? 'loaded' : 'error')}
                onError={() => setImgStatus('error')}
              />
            )}

            {imgStatus === 'loading' && pizza.image && (
              <div className="pd-image-skeleton" aria-hidden="true" />
            )}

            {(imgStatus === 'error' || !pizza.image) && (
              <div className="pd-image-fallback">
                <PizzaGlyph />
                <span>Photo coming soon</span>
              </div>
            )}

            <div className="pd-diet-badge">
              {isNonVeg ? <NonVegMark /> : <VegMark />} {isNonVeg ? 'Non-Vegetarian' : '100% Vegetarian'}
            </div>

            <div className="pd-price-tag" aria-hidden="true">
              <span className="pd-price-tag-amount">{formatPrice(pizza.price)}</span>
              <span className="pd-price-tag-label">Signature Price</span>
            </div>
          </div>

          <div className="pd-signature-strip">✦ Chef's Signature Recipe</div>
        </div>

        {/* --- RIGHT: CONTENT --- */}
        <div>
          <h1 className="pd-title">{pizza.name}</h1>

          <div className="pd-info-strip">
            <span className="pd-info-pill"><ClockIcon /> 12–15 min bake</span>
            <span className="pd-info-pill"><FlameIcon /> Wood-fired oven</span>
          </div>

          <p className="text-body-lg text-secondary pd-description" style={{ lineHeight: '1.7' }}>
            {pizza.description}
          </p>

          <div className="pd-cta-row" ref={priceRef}>
            <button
              onClick={handleCustomize}
              disabled={customizing}
              className={`btn btn-primary btn-block pd-order-btn ${customizing ? 'is-going' : ''}`}
              style={{ padding: 'var(--space-20)', fontSize: '1.05rem', fontWeight: '700', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
            >
              {customizing ? (<><span className="spinner" /> Opening studio…</>) : (<>Order &amp; Customize in Studio →</>)}
            </button>
            <p className="text-caption text-secondary" style={{ textAlign: 'center' }}>
              Want to change the base or add extra cheese? Modify this exact recipe in the studio before checkout.
            </p>
          </div>

          <div className="pd-stack-wrap">
            <div className="pd-stack-heading-row">
              <span className="pd-stack-heading-icon" aria-hidden="true"><FlameIcon /></span>
              <div>
                <h3 className="text-h4" style={{ marginBottom: '2px' }}>Built in Layers</h3>
                <p className="text-body-sm text-secondary" style={{ margin: 0 }}>From the dough up — exactly how this pie is assembled.</p>
              </div>
            </div>

            <div className="pd-timeline">
              <div className="pd-timeline-rail" aria-hidden="true" />
              {LAYER_META.map((layer, idx) => {
                const raw = pizza.defaultConfig?.[layer.key];
                const value = layer.key === 'veggies'
                  ? (Array.isArray(raw) && raw.length > 0 ? raw.join(', ') : layer.fallback)
                  : (raw || layer.fallback);
                const { Icon } = layer;

                return (
                  <div className="pd-timeline-item" key={layer.key} style={{ animationDelay: `${0.15 + idx * 0.1}s` }}>
                    <span className="pd-timeline-node" style={{ background: layer.color }}>
                      <Icon />
                      <span className="pd-timeline-step">{idx + 1}</span>
                    </span>
                    <div className="pd-timeline-card">
                      <span className="pd-timeline-label">{layer.label}</span>
                      <span className="pd-timeline-value">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showStickyBar && (
        <div className="pd-sticky-bar">
          <div className="pd-sticky-bar-inner">
            <div className="pd-sticky-price">
              <span className="text-caption" style={{ fontWeight: 700 }}>{pizza.name}</span>
              <span className="text-price" style={{ color: 'var(--primary)' }}>{formatPrice(pizza.price)}</span>
            </div>
            <button
              onClick={handleCustomize}
              disabled={customizing}
              className={`btn btn-primary pd-order-btn ${customizing ? 'is-going' : ''}`}
              style={{ padding: 'var(--space-12) var(--space-24)', fontWeight: '700' }}
            >
              {customizing ? (<><CheckIcon /> Opening…</>) : (<>Customize →</>)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}