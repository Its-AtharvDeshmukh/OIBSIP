import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

// --- Premium Inline SVGs ---
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const LoaderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// --- High-Quality Ingredient Imagery Mapping ---
// Maps exact database names to premium food photography for a tactile experience
const INGREDIENT_IMAGES = {
  'Classic Hand Tossed': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
  'Thin Crust': 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=600&auto=format&fit=crop&q=80',
  'Cheese Burst Crust': 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=600&auto=format&fit=crop&q=80',
  'Whole Wheat Crust': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'Gluten-Free Herb Crust': 'https://images.unsplash.com/photo-1585238341295-885ebaa810d2?w=600&auto=format&fit=crop&q=80',
  'Classic Marinara': 'https://images.unsplash.com/photo-1605634563968-3eab20420b9e?w=600&auto=format&fit=crop&q=80',
  'Spicy Red Pepper': 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=600&auto=format&fit=crop&q=80',
  'Creamy Garlic Alfredo': 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600&auto=format&fit=crop&q=80',
  'Smoky Chipotle Barbeque': 'https://images.unsplash.com/photo-1615486171448-4fd1ab0f18bd?w=600&auto=format&fit=crop&q=80',
  'Zesty Basil Pesto': 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&auto=format&fit=crop&q=80',
  'Fresh Mozzarella': 'https://images.unsplash.com/photo-1629517112028-d88e63ccfcb8?w=600&auto=format&fit=crop&q=80',
  'Sharp Cheddar': 'https://images.unsplash.com/photo-1618164424360-6b610c14b609?w=600&auto=format&fit=crop&q=80',
  'Gouda Blend': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80',
  'Plant-Based Vegan Cheese': 'https://images.unsplash.com/photo-1635035222044-8848d70669ce?w=600&auto=format&fit=crop&q=80',
  'Crisp Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
  'Sliced Button Mushrooms': 'https://images.unsplash.com/photo-1611105637889-3e70ef6b1d28?w=600&auto=format&fit=crop&q=80',
  'Red Onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  'Spanish Black Olives': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80',
  'Pickled Jalapeños': 'https://images.unsplash.com/photo-1625297126131-0df8cd84637e?w=600&auto=format&fit=crop&q=80',
  'Golden Sweet Corn': 'https://images.unsplash.com/photo-1562916682-4bf190e23805?w=600&auto=format&fit=crop&q=80',
  'Baby Spinach & Cherry Tomatoes': 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?w=600&auto=format&fit=crop&q=80',
};

// Graceful fallbacks by category
const DEFAULT_IMAGES = {
  base: 'https://images.unsplash.com/photo-1604152006508-5d4316d2f3db?w=600&auto=format&fit=crop&q=80',
  sauce: 'https://images.unsplash.com/photo-1552689486-f6773047d19f?w=600&auto=format&fit=crop&q=80',
  cheese: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80',
  veggie: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=600&auto=format&fit=crop&q=80'
};

const SUMMARY_HERO_IMG = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80';

// --- Price Formatter ---
const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const STEPS = [
  { id: 1, label: 'Base', subtitle: 'Select your crust', key: 'bases' },
  { id: 2, label: 'Sauce', subtitle: 'Choose a foundation', key: 'sauces' },
  { id: 3, label: 'Cheese', subtitle: 'Pick your melt', key: 'cheeses' },
  { id: 4, label: 'Veggies', subtitle: 'Add fresh toppings', key: 'veggies', isMulti: true }
];

export default function PizzaBuilder() {
  const navigate = useNavigate();
  const {
    currentStep, setCurrentStep, ingredients, loading,
    selectedBase, setSelectedBase,
    selectedSauce, setSelectedSauce,
    selectedCheese, setSelectedCheese,
    selectedVeggies, toggleVeggie,
    totalPrice
  } = usePizzaBuilder();

  // Scroll to top gently when steps change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const canGoNext = () => {
    if (currentStep === 1) return !!selectedBase;
    if (currentStep === 2) return !!selectedSauce;
    if (currentStep === 3) return !!selectedCheese;
    return true; // Veggies (Step 4) are optional
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/review'); // Preserve existing router flow
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <LoaderIcon />
        <p className="text-body text-secondary" style={{ marginTop: 'var(--space-16)' }}>Opening the kitchen...</p>
      </div>
    );
  }

  const currentStepData = STEPS.find(s => s.id === currentStep);
  const currentItems = ingredients[currentStepData.key] || [];

  return (
    <div className="container" style={{ padding: '0 var(--space-16)' }}>
      {/* Component Scoped CSS */}
      <style>{`
        .studio-header {
          padding: var(--space-48) 0 var(--space-32) 0;
          text-align: center;
        }
        
        .studio-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-40);
          padding-bottom: 120px;
        }

        /* Sophisticated Progress Stepper */
        .stepper-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-bottom: var(--space-48);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .stepper-line {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--border-light);
          z-index: 1;
        }
        
        .stepper-progress {
          position: absolute;
          top: 20px;
          left: 0;
          height: 2px;
          background: var(--primary);
          z-index: 2;
          transition: width var(--transition-slow);
        }

        .step-node {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-8);
          background: var(--bg-main);
          padding: 0 var(--space-8);
        }

        .step-indicator {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          background: var(--surface);
          border: 2px solid var(--border);
          color: var(--text-muted);
          transition: all var(--transition-normal);
        }

        .step-node.active .step-indicator {
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 0 6px var(--primary-soft);
        }

        .step-node.completed .step-indicator {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--text-inverse);
        }

        .step-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color var(--transition-fast);
        }

        .step-node.active .step-label,
        .step-node.completed .step-label {
          color: var(--text-main);
        }

        /* Visual Ingredient Grid */
        .ingredient-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-20);
          margin-bottom: var(--space-48);
        }

        .ingredient-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-fast);
          cursor: pointer;
          outline: none;
          text-align: left;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .ingredient-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }

        .ingredient-card.selected {
          border-color: var(--primary);
          box-shadow: 0 8px 20px rgba(218, 41, 28, 0.15);
        }

        .ingredient-img-wrap {
          width: 100%;
          height: 160px;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .ingredient-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .ingredient-card:hover .ingredient-img {
          transform: scale(1.05);
        }

        .ingredient-card.selected .ingredient-img {
          transform: scale(1.05);
        }

        .selection-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.8);
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .ingredient-card.selected .selection-badge {
          opacity: 1;
          transform: scale(1);
        }

        .ingredient-content {
          padding: var(--space-16);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          background: var(--surface);
          transition: background var(--transition-fast);
        }

        .ingredient-card.selected .ingredient-content {
          background: var(--primary-soft);
        }

        /* Persistent Summary Sidebar */
        .summary-sidebar {
          display: none;
        }

        .receipt-card {
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .receipt-hero {
          width: 100%;
          height: 140px;
          background-image: url('${SUMMARY_HERO_IMG}');
          background-size: cover;
          background-position: center;
          position: relative;
        }
        
        .receipt-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, var(--surface) 100%);
        }

        .receipt-body {
          padding: 0 var(--space-24) var(--space-24) var(--space-24);
        }

        .receipt-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
          margin-top: var(--space-8);
        }

        .receipt-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px dashed var(--border-light);
          padding-bottom: var(--space-12);
        }

        .receipt-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .receipt-value {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-align: right;
          max-width: 60%;
        }

        .receipt-empty {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Mobile Action Bar */
        .mobile-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--surface);
          border-top: 1px solid var(--border-light);
          padding: var(--space-16) var(--space-20);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          z-index: var(--z-fixed);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: calc(var(--space-16) + env(safe-area-inset-bottom));
        }

        .desktop-actions {
          display: none;
        }

        @media (min-width: 1024px) {
          .studio-layout {
            grid-template-columns: 2fr 1fr;
            padding-bottom: var(--space-64);
            align-items: start;
          }
          .summary-sidebar {
            display: block;
            position: sticky;
            top: 100px;
          }
          .mobile-action-bar {
            display: none;
          }
          .desktop-actions {
            display: flex;
            justify-content: space-between;
            margin-top: var(--space-32);
            padding-top: var(--space-24);
            border-top: 1px solid var(--border-light);
          }
        }
      `}</style>

      {/* --- STUDIO HEADER --- */}
      <div className="studio-header">
        <h1 className="text-display">Pizza Craft Studio</h1>
        <p className="text-body-lg text-secondary" style={{ marginTop: 'var(--space-8)' }}>
          Design your perfect pizza with our premium ingredients.
        </p>
      </div>

      <div className="studio-layout">
        {/* --- LEFT: BUILDER WORKSPACE --- */}
        <div>
          {/* Progress Stepper */}
          <div className="stepper-container">
            <div className="stepper-line" />
            <div 
              className="stepper-progress" 
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} 
            />
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-indicator">
                    {isCompleted ? <CheckIcon /> : step.id}
                  </div>
                  <span className="step-label desktop-only">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Section Header */}
          <div style={{ marginBottom: 'var(--space-24)' }}>
            <h2 className="text-h2">{currentStepData.label}</h2>
            <p className="text-body text-secondary">{currentStepData.subtitle}</p>
          </div>

          {/* Ingredient Grid */}
          <div className="ingredient-grid">
            {currentItems.map((item) => {
              let isSelected = false;
              if (currentStep === 1) isSelected = selectedBase?._id === item._id;
              if (currentStep === 2) isSelected = selectedSauce?._id === item._id;
              if (currentStep === 3) isSelected = selectedCheese?._id === item._id;
              if (currentStep === 4) isSelected = selectedVeggies.some(v => v._id === item._id);

              const handleSelect = () => {
                if (currentStep === 1) setSelectedBase(item);
                if (currentStep === 2) setSelectedSauce(item);
                if (currentStep === 3) setSelectedCheese(item);
                if (currentStep === 4) toggleVeggie(item);
              };

              const imgSrc = INGREDIENT_IMAGES[item.name] || DEFAULT_IMAGES[item.category];

              return (
                <button 
                  key={item._id} 
                  type="button"
                  className={`ingredient-card ${isSelected ? 'selected' : ''}`}
                  onClick={handleSelect}
                  aria-pressed={isSelected}
                >
                  <div className="ingredient-img-wrap">
                    <img 
                      src={imgSrc} 
                      alt={item.name} 
                      className="ingredient-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="selection-badge">
                      <CheckIcon />
                    </div>
                  </div>
                  <div className="ingredient-content">
                    <h3 className="text-body" style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: 'var(--space-8)' }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                      <span className="text-price" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        +{formatPrice(item.price)}
                      </span>
                      {item.stock <= 10 && (
                        <span className="text-caption text-muted">Few left</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty Category Fallback */}
          {currentItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-48)', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <p className="text-body text-muted">No {currentStepData.label.toLowerCase()} options currently available.</p>
            </div>
          )}

          {/* Desktop Navigation Actions */}
          <div className="desktop-actions">
            <button onClick={handleBack} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronLeftIcon /> {currentStep === 1 ? 'Back to Menu' : 'Previous Step'}
            </button>
            <button onClick={handleNext} disabled={!canGoNext()} className="btn btn-primary" style={{ padding: 'var(--space-12) var(--space-48)' }}>
              {currentStep === 4 ? 'Review Order →' : 'Next Step →'}
            </button>
          </div>
        </div>

        {/* --- RIGHT: PERSISTENT SUMMARY RECEIPT (DESKTOP) --- */}
        <aside className="summary-sidebar">
          <div className="receipt-card">
            <div className="receipt-hero" />
            <div className="receipt-body">
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-16)' }}>Your Masterpiece</h3>
              <ul className="receipt-list">
                <li className="receipt-item">
                  <span className="receipt-label">Crust</span>
                  {selectedBase ? (
                    <span className="receipt-value">{selectedBase.name}</span>
                  ) : (
                    <span className="receipt-empty">Not selected</span>
                  )}
                </li>
                <li className="receipt-item">
                  <span className="receipt-label">Sauce</span>
                  {selectedSauce ? (
                    <span className="receipt-value">{selectedSauce.name}</span>
                  ) : (
                    <span className="receipt-empty">Not selected</span>
                  )}
                </li>
                <li className="receipt-item">
                  <span className="receipt-label">Cheese</span>
                  {selectedCheese ? (
                    <span className="receipt-value">{selectedCheese.name}</span>
                  ) : (
                    <span className="receipt-empty">Not selected</span>
                  )}
                </li>
                <li className="receipt-item" style={{ borderBottom: 'none' }}>
                  <span className="receipt-label">Veggies</span>
                  {selectedVeggies.length > 0 ? (
                    <span className="receipt-value">{selectedVeggies.map(v => v.name).join(', ')}</span>
                  ) : (
                    <span className="receipt-empty">None added</span>
                  )}
                </li>
              </ul>

              <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-16)', borderTop: '2px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-h4">Total</span>
                <span className="text-price" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- MOBILE: STICKY BOTTOM BAR --- */}
      <div className="mobile-action-bar">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-caption text-secondary" style={{ marginBottom: '2px' }}>Order Total</span>
          <span className="text-price" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{formatPrice(totalPrice)}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {currentStep > 1 && (
            <button onClick={handleBack} className="btn btn-outline" style={{ padding: 'var(--space-12)', minWidth: '48px' }} aria-label="Previous step">
              <ChevronLeftIcon />
            </button>
          )}
          <button 
            onClick={handleNext} 
            disabled={!canGoNext()} 
            className="btn btn-primary"
            style={{ padding: 'var(--space-12) var(--space-24)' }}
          >
            {currentStep === 4 ? 'Review Order' : 'Next Step'}
          </button>
        </div>
      </div>

    </div>
  );
}