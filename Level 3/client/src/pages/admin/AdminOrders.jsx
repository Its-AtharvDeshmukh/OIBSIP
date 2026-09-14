import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

// --- Premium Minimalist Icons ---
const RefreshIcon = ({ spinning }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: spinning ? 'spin 1s linear infinite' : 'none' }}>
    <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MapPinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const CheckCircleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

const STATUS_FLOW = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const toast = useToast();

  const fetchOrders = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setRefreshing(true);
      const { data } = await API.get('/admin/orders');
      const fetchedOrders = Array.isArray(data) ? data : (data.data || []);
      setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError('Failed to fetch incoming kitchen orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedOrder) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedOrder]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Optimistic Update for both the grid and the open modal
      const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
      setOrders(updatedOrders);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      
      await API.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Moved to: ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
      fetchOrders(true); // Revert on failure
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivery')) return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
    if (s.includes('kitchen')) return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    return { bg: 'var(--primary-soft)', color: 'var(--primary)', border: 'rgba(218, 41, 28, 0.2)' };
  };

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0 var(--space-80) 0' }}>
      <style>{`
        /* --- Cinematic Animations --- */
        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stagger-card {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        /* --- Header --- */
        .admin-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: var(--space-40); padding-bottom: var(--space-20);
          border-bottom: 1px solid var(--border-light);
        }

        /* --- Compact Grid --- */
        .compact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .compact-card {
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .compact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          border-color: var(--border);
        }

        .card-top {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        
        .c-id { font-family: monospace; font-size: 1.1rem; font-weight: 800; color: var(--text-main); }
        .c-time { font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        
        .c-status {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 8px 16px; border-radius: 99px; font-weight: 700; font-size: 0.85rem;
          border: 1px solid; width: 100%;
        }

        .card-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 16px; border-top: 1px dashed var(--border-light);
        }

        .c-customer { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .c-price { font-size: 1.1rem; font-weight: 800; color: var(--text-main); }

        /* --- Glassmorphism Modal --- */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease forwards;
        }

        .modal-content {
          background: white;
          width: 100%; max-width: 800px;
          max-height: 90vh; overflow-y: auto;
          border-radius: 32px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.2);
          animation: fadeScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex; flex-direction: column;
        }

        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 32px; border-bottom: 1px solid var(--border-light);
          position: sticky; top: 0; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px); z-index: 10;
        }

        .modal-close {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--bg-secondary); border: none;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-main); cursor: pointer; transition: background 0.2s;
        }
        .modal-close:hover { background: #e2e8f0; }

        .modal-body {
          padding: 32px;
          display: grid; grid-template-columns: 1fr; gap: 32px;
        }

        /* --- Bento Inside Modal --- */
        .bento-section {
          background: #f8fafc; border: 1px solid var(--border-light);
          border-radius: 24px; padding: 24px;
        }

        .bento-title {
          font-size: 0.85rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 16px;
        }

        .info-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-icon { color: var(--primary); margin-top: 2px; }
        .info-text { font-size: 1rem; color: var(--text-main); font-weight: 500; line-height: 1.4; }

        .config-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .config-tag {
          background: white; border: 1px solid var(--border-light);
          color: var(--text-main); padding: 8px 12px; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        /* --- Progression Control --- */
        .progression-track {
          display: flex; flex-direction: column; gap: 12px;
        }
        
        .prog-step {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px; border-radius: 16px; background: white;
          border: 1px solid var(--border-light); transition: all 0.2s;
        }

        .prog-step.completed { background: #dcfce7; border-color: #bbf7d0; color: #166534; }
        .prog-step.active { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }

        .btn-move {
          background: var(--primary); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: transform 0.2s;
        }
        .btn-move:hover { transform: scale(1.05); }

        @media (min-width: 768px) {
          .modal-body { grid-template-columns: 1fr 1fr; }
          .progression-container { grid-column: span 2; }
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="admin-header">
        <div>
          <Link to="/admin/dashboard" className="text-body-sm text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px', fontWeight: '600' }}>
            ← Back to Admin Console
          </Link>
          <h1 className="text-h1">Live Kitchen Orders</h1>
          <p className="text-body-sm text-secondary" style={{ marginTop: '8px' }}>Monitor and process active orders at a glance.</p>
        </div>
        <button 
          onClick={() => fetchOrders(false)} 
          className="btn btn-outline"
          disabled={refreshing}
          style={{ padding: '12px 20px', borderRadius: '99px', background: 'white' }}
        >
          <RefreshIcon spinning={refreshing} />
          <span>{refreshing ? 'Syncing...' : 'Refresh Feed'}</span>
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* --- COMPACT GRID --- */}
      {loading ? (
        <div className="compact-grid">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="compact-card" style={{ height: '180px', animation: 'pulse 1.5s infinite', background: 'var(--bg-secondary)', border: 'none' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--bg-main)', borderStyle: 'dashed' }}>
          <span style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>🍽️</span>
          <h3 className="text-h3" style={{ marginBottom: '8px' }}>The kitchen is clear</h3>
          <p className="text-body text-secondary">No active customer orders found in the system right now.</p>
        </div>
      ) : (
        <div className="compact-grid">
          {orders.map((order, index) => {
            const style = getStatusBadge(order.orderStatus);
            return (
              <div 
                key={order._id} 
                className="compact-card stagger-card" 
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="card-top">
                  <div>
                    <div className="c-id">#{order._id.slice(-6).toUpperCase()}</div>
                    <div className="c-time"><ClockIcon /> {formatTime(order.createdAt)}</div>
                  </div>
                </div>
                
                <div className="c-status" style={{ background: style.bg, color: style.color, borderColor: style.border }}>
                  {order.orderStatus}
                </div>

                <div className="card-bottom">
                  <div className="c-customer">{order.customerInfo?.name || order.user?.name || 'Guest'}</div>
                  <div className="c-price">{formatPrice(order.totalAmount)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- POP-UP MODAL --- */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedOrder(null); }}>
          <div className="modal-content">
            
            <div className="modal-header">
              <div>
                <h2 className="text-h2" style={{ margin: 0 }}>Order Details</h2>
                <span className="text-body-sm text-secondary" style={{ fontFamily: 'monospace' }}>#{selectedOrder._id}</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              
              {/* Customer Info Bento */}
              <div className="bento-section">
                <div className="bento-title">Customer Details</div>
                <div className="info-row">
                  <div className="info-icon"><UserIcon /></div>
                  <div className="info-text">
                    <span style={{ fontWeight: '700', display: 'block' }}>{selectedOrder.customerInfo?.name || selectedOrder.user?.name || 'Guest'}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedOrder.customerInfo?.phone || 'No phone provided'}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><MapPinIcon /></div>
                  <div className="info-text" style={{ color: 'var(--text-secondary)' }}>
                    {selectedOrder.customerInfo?.address || 'No delivery address provided'}
                  </div>
                </div>
                <div className="info-row" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-light)' }}>
                  <div className="info-text" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>TOTAL PAID</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Recipe Bento */}
              <div className="bento-section">
                <div className="bento-title">Recipe Configuration</div>
                <div className="config-tags">
                  <div className="config-tag">🍕 {selectedOrder.pizzaConfig?.base || 'Base'}</div>
                  <div className="config-tag">🍅 {selectedOrder.pizzaConfig?.sauce || 'Sauce'}</div>
                  <div className="config-tag">🧀 {selectedOrder.pizzaConfig?.cheese || 'Cheese'}</div>
                  {selectedOrder.pizzaConfig?.veggies && selectedOrder.pizzaConfig.veggies.length > 0 ? (
                    selectedOrder.pizzaConfig.veggies.map(veg => (
                      <div key={veg} className="config-tag">🥬 {veg}</div>
                    ))
                  ) : (
                    <div className="config-tag" style={{ color: 'var(--text-muted)' }}>No veggies</div>
                  )}
                </div>
              </div>

              {/* Progression Bento */}
              <div className="bento-section progression-container">
                <div className="bento-title">Update Progression</div>
                <div className="progression-track">
                  {STATUS_FLOW.map((stage, idx) => {
                    const currentStageIndex = STATUS_FLOW.findIndex(s => s.toLowerCase() === selectedOrder.orderStatus?.toLowerCase());
                    const isCompleted = idx <= currentStageIndex;
                    const isNext = idx === currentStageIndex + 1;
                    const isFuture = idx > currentStageIndex + 1;

                    return (
                      <div key={stage} className={`prog-step ${isCompleted ? 'completed' : isNext ? 'active' : ''}`} style={{ opacity: isFuture ? 0.5 : 1 }}>
                        <span style={{ fontWeight: isCompleted || isNext ? '700' : '500', fontSize: '1.05rem' }}>
                          {stage}
                        </span>
                        
                        {isCompleted ? (
                          <CheckCircleIcon />
                        ) : isNext ? (
                          <button 
                            onClick={() => handleStatusUpdate(selectedOrder._id, stage)}
                            className="btn-move"
                          >
                            Move to {stage}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Pending</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}