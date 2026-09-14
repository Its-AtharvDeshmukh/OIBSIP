import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

// --- Premium Icons ---
const ReceiptIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const OvenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="2" y1="7" x2="22" y2="7"></line>
    <line x1="6" y1="21" x2="6" y2="17"></line>
    <line x1="18" y1="21" x2="18" y2="17"></line>
    <path d="M12 11v4"></path>
    <path d="M8 11v4"></path>
    <path d="M16 11v4"></path>
  </svg>
);

const ScooterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="17" r="3"></circle>
    <circle cx="17" cy="17" r="3"></circle>
    <line x1="14" y1="17" x2="10" y2="17"></line>
    <line x1="7" y1="14" x2="7" y2="13"></line>
    <path d="M17 14v-4l-3-3h-4v7"></path>
    <line x1="2" y1="10" x2="5" y2="10"></line>
    <line x1="3" y1="6" x2="6" y2="6"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const LoaderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// Formatters
const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  return new Date(dateString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

// --- Exact Backend Contracts ---
const STATUS_STAGES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

const STAGE_DETAILS = {
  'Order Received': { title: 'Order Confirmed', desc: 'The kitchen has received your request.', icon: ReceiptIcon },
  'In Kitchen': { title: 'In the Oven', desc: 'Our chef is preparing your masterpiece.', icon: OvenIcon },
  'Sent to Delivery': { title: 'Out for Delivery', desc: 'Your pizza is on the way to your door!', icon: ScooterIcon }
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.data || data); 
      } catch (err) {
        setError('Unable to load order tracking details. It may not exist.');
      }
    };

    fetchOrder();

    // Secure Socket.IO connection to port 5001
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const socket = io(socketUrl);
    
    socket.emit('joinOrderRoom', orderId);
    
    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) => ({ 
          ...prev, 
          orderStatus: data.orderStatus, 
          updatedAt: data.updatedAt 
        }));
        toast.addToast(`Order Status Updated: ${data.orderStatus}`, 'success');
      }
    });

    return () => socket.disconnect();
  }, [orderId, toast]);

  if (error) {
    return (
      <div className="container" style={{ padding: 'var(--space-64) 0', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '400px', margin: '0 auto' }}>{error}</div>
        <Link to="/orders" className="btn btn-outline" style={{ marginTop: 'var(--space-24)' }}>View All Orders</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <LoaderIcon />
        <p className="text-body text-secondary" style={{ marginTop: 'var(--space-16)' }}>Connecting to Live Tracker...</p>
      </div>
    );
  }

  let currentStageIndex = STATUS_STAGES.findIndex(s => s.toLowerCase() === order.orderStatus?.toLowerCase());
  if (currentStageIndex === -1) currentStageIndex = 0; 
  
  // Calculate a fake ETA for UI premium feel (approx 35 mins from order creation)
  const orderDate = new Date(order.createdAt || Date.now());
  const etaDate = new Date(orderDate.getTime() + 35 * 60000);

  return (
    <div className="container" style={{ padding: 'var(--space-40) var(--space-16) var(--space-80) var(--space-16)' }}>
      <style>{`
        .tracking-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-32);
          align-items: start;
        }

        /* Map Hero Section */
        .map-hero {
          width: 100%;
          height: 240px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--space-32);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: radial-gradient(var(--text-main) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .pulse-pin {
          width: 48px;
          height: 48px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          box-shadow: 0 8px 16px rgba(218, 41, 28, 0.3);
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--primary);
          z-index: 1;
          animation: mapPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(3); opacity: 0; }
        }

        /* Vertical Timeline */
        .timeline-container {
          position: relative;
          padding-left: 32px;
        }
        
        .timeline-line {
          position: absolute;
          left: 21px; /* Center of the 44px icon */
          top: 0;
          bottom: 40px;
          width: 2px;
          background: var(--border-light);
          z-index: 1;
        }

        .timeline-progress {
          position: absolute;
          left: 21px;
          top: 0;
          width: 2px;
          background: var(--primary);
          z-index: 2;
          transition: height var(--transition-slow);
        }

        .timeline-step {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: flex-start;
          gap: var(--space-20);
          margin-bottom: var(--space-40);
          opacity: 0.5;
          transition: opacity var(--transition-normal);
        }

        .timeline-step:last-child {
          margin-bottom: 0;
        }

        .timeline-step.active, .timeline-step.past {
          opacity: 1;
        }

        .step-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--surface);
          border: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
          transition: all var(--transition-normal);
          position: relative;
          left: -11px; /* Offset to align center with the line */
        }

        .timeline-step.past .step-icon-wrap {
          background: var(--success);
          border-color: var(--success);
          color: var(--text-inverse);
        }

        .timeline-step.active .step-icon-wrap {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--text-inverse);
          box-shadow: 0 0 0 6px var(--primary-soft);
        }

        .step-content {
          padding-top: 4px;
        }

        .step-title {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .timeline-step:not(.active):not(.past) .step-title {
          color: var(--text-muted);
        }

        /* Order Details Sidebar */
        .order-details-card {
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-32);
          box-shadow: var(--shadow-sm);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-12) 0;
          border-bottom: 1px dashed var(--border-light);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        @media (min-width: 1024px) {
          .tracking-grid {
            grid-template-columns: 1.2fr 1fr;
            gap: var(--space-64);
          }
          .map-hero {
            height: 300px;
          }
          .sticky-sidebar {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-24)' }}>
        <div>
          <Link to="/orders" className="text-body-sm text-secondary" style={{ display: 'inline-block', marginBottom: 'var(--space-8)' }}>
            ← Back to Orders
          </Link>
          <h1 className="text-display" style={{ fontSize: '2rem' }}>Tracking Order</h1>
          <p className="text-body-sm text-secondary" style={{ fontFamily: 'monospace', marginTop: '4px' }}>#{order._id}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="text-caption text-secondary" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Arrival</span>
          <span className="text-h3" style={{ color: 'var(--primary)' }}>{formatTime(etaDate)}</span>
        </div>
      </div>

      <div className="tracking-grid">
        
        {/* Left Column: Map & Timeline */}
        <div>
          {/* Abstract Map Area */}
          <div className="map-hero">
            <div className="pulse-pin">
              <div className="pulse-ring"></div>
              <MapPinIcon />
            </div>
            
            {/* Delivery address banner overlay */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--primary)' }}><MapPinIcon /></div>
              <div style={{ overflow: 'hidden' }}>
                <span className="text-caption text-secondary" style={{ display: 'block' }}>Delivering to:</span>
                <span className="text-body-sm" style={{ fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block', overflow: 'hidden' }}>
                  {order.customerInfo?.address || 'Address not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="card" style={{ padding: 'var(--space-32) var(--space-24)' }}>
            <h2 className="text-h3" style={{ marginBottom: 'var(--space-32)' }}>Order Status</h2>
            
            <div className="timeline-container">
              <div className="timeline-line" />
              
              {/* Calculate progress bar height based on stages */}
              <div className="timeline-progress" style={{ 
                height: currentStageIndex === 0 ? '0%' : currentStageIndex === 1 ? '50%' : '100%' 
              }} />
              
              {STATUS_STAGES.map((stageName, idx) => {
                const isActive = idx === currentStageIndex;
                const isPast = idx < currentStageIndex;
                const details = STAGE_DETAILS[stageName];
                const Icon = details.icon;
                
                return (
                  <div key={stageName} className={`timeline-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                    <div className="step-icon-wrap">
                      {isPast ? <CheckIcon /> : <Icon />}
                    </div>
                    <div className="step-content">
                      <h3 className="step-title">{details.title}</h3>
                      <p className="text-body-sm text-secondary">
                        {details.desc}
                      </p>
                      {isActive && (
                        <p className="text-caption" style={{ color: 'var(--primary)', marginTop: '8px', fontWeight: '600' }}>
                          Updated {formatTime(order.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="sticky-sidebar">
          <div className="order-details-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-24)' }}>
              <h2 className="text-h3">Receipt</h2>
              <span className={`badge ${currentStageIndex === 2 ? 'badge-success' : 'badge-primary'}`}>
                {order.orderStatus}
              </span>
            </div>

            <div style={{ marginBottom: 'var(--space-24)' }}>
              <span className="text-caption text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Customer</span>
              <p className="text-body-sm" style={{ fontWeight: '600' }}>{order.customerInfo?.name || 'Customer'}</p>
              <p className="text-body-sm text-secondary">{order.customerInfo?.phone || ''}</p>
            </div>

            <h3 className="text-body-sm" style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
              Your Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-32)' }}>
              <div className="detail-row">
                <span className="text-body-sm text-secondary">Base</span>
                <span className="text-body-sm" style={{ fontWeight: '600' }}>{order.pizzaConfig?.base || '--'}</span>
              </div>
              <div className="detail-row">
                <span className="text-body-sm text-secondary">Sauce</span>
                <span className="text-body-sm" style={{ fontWeight: '600' }}>{order.pizzaConfig?.sauce || '--'}</span>
              </div>
              <div className="detail-row">
                <span className="text-body-sm text-secondary">Cheese</span>
                <span className="text-body-sm" style={{ fontWeight: '600' }}>{order.pizzaConfig?.cheese || '--'}</span>
              </div>
              <div className="detail-row" style={{ borderBottom: 'none' }}>
                <span className="text-body-sm text-secondary">Veggies</span>
                <span className="text-body-sm" style={{ fontWeight: '600', textAlign: 'right', maxWidth: '60%' }}>
                  {order.pizzaConfig?.veggies && order.pizzaConfig.veggies.length > 0 
                    ? order.pizzaConfig.veggies.join(', ') 
                    : 'None'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-light)', paddingTop: 'var(--space-20)' }}>
              <span className="text-h3">Total Paid</span>
              <span className="text-price" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}