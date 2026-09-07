import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';

const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function ReviewOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedBase, selectedSauce, selectedCheese, selectedVeggies, 
    totalPrice, resetCustomPizza 
  } = usePizzaBuilder();

  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Protect against direct navigation without building a pizza
  useEffect(() => {
    if (!selectedBase) {
      navigate('/builder');
    }
  }, [selectedBase, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      return setError('Please provide a complete delivery address.');
    }
    
    if (!window.Razorpay) {
      return setError('Payment gateway failed to load. Please check your connection.');
    }

    try {
      setIsProcessing(true);
      setError('');

      // 1. Initialize Razorpay Order via Backend
      // EXACT match to what paymentController.js expects
      const { data: orderResponse } = await API.post('/payment/create-order', {
        pizzaConfig: {
          base: selectedBase.name,
          sauce: selectedSauce.name,
          cheese: selectedCheese.name,
          veggies: selectedVeggies.map((v) => v.name)
        },
        customerInfo: {
          name: user?.name || 'Guest',
          email: user?.email || 'guest@example.com',
          address: address,
          phone: '9999999999' // Standard placeholder
        }
      });

      const { orderId, razorpayOrderId, amount, currency, keyId } = orderResponse;

      // 2. Configure Razorpay UI
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || "INR",
        name: "Pizza Craft",
        description: "Custom Artisan Pizza",
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: "#DA291C" // Matches our --primary brand color
        },
        handler: async function (response) {
          try {
            setIsProcessing(true); // Keep loading state active during verification
            
            // 3. Verify Payment with Backend and Decrement Stock
            await API.post('/payment/verify', {
              orderId: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // 4. Cleanup & Redirect
            resetCustomPizza();
            navigate(`/order/success/${orderId}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment signature verification failed.');
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError('Payment was cancelled or failed. Please try again.');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize secure payment gateway.');
      setIsProcessing(false);
    }
  };

  if (!selectedBase) return null; // Prevent flicker while redirecting

  return (
    <div className="container">
      <style>{`
        .review-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-32);
          padding: var(--space-48) 0 var(--space-64) 0;
        }
        .checkout-section {
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-32);
          box-shadow: var(--shadow-sm);
        }
        .summary-list {
          list-style: none;
          margin-bottom: var(--space-24);
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: var(--space-12) 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .summary-item:last-child {
          border-bottom: none;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-20);
          margin-top: var(--space-8);
          border-top: 2px solid var(--border-light);
        }
        @media (min-width: 1024px) {
          .review-layout {
            grid-template-columns: 1.5fr 1fr;
            align-items: start;
          }
          .sticky-summary {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>

      <h1 className="text-h1" style={{ marginBottom: 'var(--space-8)' }}>Review Your Order</h1>
      <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-32)' }}>
        Almost there! Confirm your details to place the order.
      </p>

      <div className="review-layout">
        
        {/* Left Column: Delivery Form */}
        <div className="checkout-section">
          <h2 className="text-h3" style={{ marginBottom: 'var(--space-24)' }}>Delivery Details</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label className="form-label" htmlFor="address">Full Delivery Address</label>
              <textarea
                id="address"
                className="form-input"
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street address, building, apartment, and zip code..."
                style={{ resize: 'vertical' }}
                disabled={isProcessing}
                required
              />
              <p className="text-caption" style={{ marginTop: 'var(--space-8)' }}>
                Please provide accurate details to ensure hot and timely delivery.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={isProcessing}
              style={{ marginTop: 'var(--space-24)', padding: 'var(--space-16)' }}
            >
              {isProcessing ? 'Initializing Secure Payment...' : `Pay ${formatPrice(totalPrice)}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', marginTop: 'var(--space-16)', color: 'var(--text-muted)' }}>
              <LockIcon />
              <span className="text-caption">Payments secured by Razorpay (Test Mode)</span>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-section sticky-summary">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-24)' }}>
            <h2 className="text-h3">Order Summary</h2>
            <Link to="/builder" className="text-body-sm" style={{ color: 'var(--primary)', fontWeight: '600' }}>Edit Pizza</Link>
          </div>

          <ul className="summary-list">
            <li className="summary-item">
              <span className="text-body" style={{ fontWeight: '600' }}>Base</span>
              <span className="text-body text-secondary">{selectedBase.name}</span>
            </li>
            <li className="summary-item">
              <span className="text-body" style={{ fontWeight: '600' }}>Sauce</span>
              <span className="text-body text-secondary">{selectedSauce.name}</span>
            </li>
            <li className="summary-item">
              <span className="text-body" style={{ fontWeight: '600' }}>Cheese</span>
              <span className="text-body text-secondary">{selectedCheese.name}</span>
            </li>
            <li className="summary-item" style={{ flexDirection: 'column', gap: 'var(--space-4)', borderBottom: 'none' }}>
              <span className="text-body" style={{ fontWeight: '600' }}>Vegetables</span>
              <span className="text-body-sm text-secondary">
                {selectedVeggies.length > 0 ? selectedVeggies.map(v => v.name).join(', ') : 'None selected'}
              </span>
            </li>
          </ul>

          <div className="total-row">
            <span className="text-h3">Total to Pay</span>
            <span className="text-price" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}