import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// --- Premium UI Icons ---
const ReceiptIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const HistoryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5"></path>
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
    <polyline points="12 7 12 12 15 15"></polyline>
  </svg>
);

const BoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// --- Formatters ---
const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Source of truth backend contract
        const { data } = await API.get('/orders/my-orders');
        const fetchedOrders = Array.isArray(data) ? data : (data.data || []);
        // Sort newest first
        setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError('Failed to load your order history. Please try again later.');
      } finally {
        setTimeout(() => setLoading(false), 400); // Smooth entrance
      }
    };
    fetchOrders();
    window.scrollTo(0, 0);
  }, []);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivery')) return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
    if (s.includes('kitchen')) return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    return { bg: 'var(--primary-soft)', color: 'var(--primary)', border: 'rgba(218, 41, 28, 0.1)' };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#f8fafc' }}>
        <style>{`
          .editorial-loader { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="editorial-loader"></div>
        <p className="text-body-sm text-secondary" style={{ marginTop: '16px', fontWeight: '600' }}>Fetching your history...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 'var(--space-48) 0 var(--space-80) 0' }}>
      <style>{`
        /* --- Cinematic Animations --- */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .stagger-anim {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        /* --- Layout --- */
        .orders-feed-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 var(--space-20);
        }

        /* --- Header --- */
        .feed-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
        }

        .header-icon-box {
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border: 1px solid var(--border-light);
        }

        /* --- Order Cards --- */
        .order-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid var(--border-light);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .order-id {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .order-date {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
        }

        .order-card-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-top: 1px dashed var(--border-light);
          border-bottom: 1px dashed var(--border-light);
          margin-bottom: 20px;
        }

        .price-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        /* --- Ingredients Chips --- */
        .config-chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .config-chip {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* --- Actions --- */
        .order-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-track {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 99px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(218, 41, 28, 0.2);
        }

        .btn-track:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(218, 41, 28, 0.3);
        }

        .btn-receipt {
          background: white;
          color: var(--text-main);
          border: 1px solid var(--border);
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-receipt:hover {
          background: var(--bg-secondary);
          border-color: var(--text-main);
        }

        @media (max-width: 600px) {
          .order-card-body {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .order-actions {
            flex-direction: column;
          }
          .btn-track, .btn-receipt {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <div className="orders-feed-container">
        
        <div className="feed-header stagger-anim" style={{ animationDelay: '0.1s' }}>
          <div className="header-icon-box">
            <HistoryIcon />
          </div>
          <div>
            <h1 className="text-h1" style={{ margin: 0, fontSize: '2rem' }}>My Orders</h1>
            <p className="text-body-sm text-secondary" style={{ marginTop: '4px' }}>Track your live deliveries and past receipts.</p>
          </div>
        </div>
        
        {error && <div className="alert alert-danger stagger-anim">{error}</div>}
        
        {!error && orders.length === 0 ? (
          <div className="stagger-anim" style={{ animationDelay: '0.2s', textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--border)' }}>
              <BoxIcon />
            </div>
            <h2 className="text-h3" style={{ marginBottom: '12px' }}>No orders found</h2>
            <p className="text-body text-secondary" style={{ marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
              It looks like you haven't crafted your first pizza yet. Step into the studio and build your masterpiece!
            </p>
            <Link to="/builder" className="btn btn-primary" style={{ padding: '14px 32px', borderRadius: '99px', fontSize: '1.05rem' }}>
              Enter The Studio →
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order, index) => {
              const statusStyle = getStatusStyle(order.orderStatus);
              // Calculate a staggered delay for the first 5 items, then cap it
              const delay = Math.min(0.2 + (index * 0.1), 0.8);

              return (
                <div key={order._id} className="order-card stagger-anim" style={{ animationDelay: `${delay}s` }}>
                  
                  {/* --- Card Header --- */}
                  <div className="order-card-header">
                    <div>
                      <h3 className="order-id">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <span 
                      className="status-pill" 
                      style={{ 
                        background: statusStyle.bg, 
                        color: statusStyle.color, 
                        borderColor: statusStyle.border 
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* --- Card Body (Price & Configuration) --- */}
                  <div className="order-card-body">
                    <div>
                      <span className="text-caption text-secondary" style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Total Paid</span>
                      <div className="price-text">{formatPrice(order.totalAmount)}</div>
                    </div>

                    <div className="config-chip-group" style={{ flex: 1, marginLeft: '24px', justifyContent: 'flex-end' }}>
                      <span className="config-chip">🍕 {order.pizzaConfig?.base || 'Base'}</span>
                      <span className="config-chip">🍅 {order.pizzaConfig?.sauce || 'Sauce'}</span>
                      <span className="config-chip">🧀 {order.pizzaConfig?.cheese || 'Cheese'}</span>
                      {order.pizzaConfig?.veggies && order.pizzaConfig.veggies.length > 0 && (
                        <span className="config-chip" style={{ background: '#f0fdf4', color: '#166534' }}>
                          🥬 +{order.pizzaConfig.veggies.length} Veggies
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info (Optional nice touch if address exists) */}
                  {order.customerInfo?.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                      <MapPinIcon />
                      <span style={{ fontSize: '0.85rem', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.customerInfo.address}
                      </span>
                    </div>
                  )}

                  {/* --- Card Actions --- */}
                  <div className="order-actions">
                    <Link to={`/orders/${order._id}`} className="btn-receipt">
                      <ReceiptIcon /> View Receipt
                    </Link>
                    <Link to={`/track/${order._id}`} className="btn-track">
                      Track Live Status
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}