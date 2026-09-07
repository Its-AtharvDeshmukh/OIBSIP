import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const STATUS_STAGES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

const LoaderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    // 1. Fetch initial status via REST
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.data || data); // Handle varying backend response wrappings
      } catch (err) {
        setError('Unable to load order tracking details. It may not exist.');
      }
    };
    fetchOrder();

    // 2. Connect to Socket.IO for real-time updates
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    socket.emit('joinOrder', `order_${orderId}`);
    
    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrder(updatedOrder);
      toast.addToast(`Order Status Updated: ${updatedOrder.status}`, 'success');
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
        <p className="text-body text-secondary" style={{ marginTop: 'var(--space-16)' }}>Locating your order...</p>
      </div>
    );
  }

  // Ensure robust fallback if status string doesn't perfectly match
  let currentStageIndex = STATUS_STAGES.findIndex(s => s.toLowerCase() === order.status?.toLowerCase());
  if (currentStageIndex === -1) currentStageIndex = 0; // Default to first stage if unknown

  return (
    <div className="container" style={{ padding: 'var(--space-48) var(--space-16)' }}>
      <style>{`
        .timeline-container {
          position: relative;
          padding-left: var(--space-24);
          margin-top: var(--space-40);
        }
        
        .timeline-line {
          position: absolute;
          left: 11px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-light);
          z-index: 1;
        }

        .timeline-step {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          gap: var(--space-20);
          margin-bottom: var(--space-48);
          opacity: 0.5;
          transition: opacity var(--transition-normal);
        }

        .timeline-step:last-child {
          margin-bottom: 0;
        }

        .timeline-step.active, .timeline-step.past {
          opacity: 1;
        }

        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-pill);
          background: var(--surface);
          border: 2px solid var(--border-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition-normal);
        }

        .timeline-step.past .step-indicator {
          background: var(--success);
          border-color: var(--success);
          color: var(--text-inverse);
        }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(218, 41, 28, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(218, 41, 28, 0); }
          100% { box-shadow: 0 0 0 0 rgba(218, 41, 28, 0); }
        }

        .timeline-step.active .step-indicator {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--text-inverse);
          animation: pulseRing 2s infinite;
        }
      `}</style>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-48) var(--space-32)' }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-24)' }}>
          <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Live Tracking</h1>
          <p className="text-body-sm text-secondary" style={{ fontFamily: 'monospace' }}>Order #{order._id}</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line" />
          
          {STATUS_STAGES.map((stage, idx) => {
            const isActive = idx === currentStageIndex;
            const isPast = idx < currentStageIndex;
            
            return (
              <div key={stage} className={`timeline-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                <div className="step-indicator">
                  {isPast ? <CheckIcon /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />}
                </div>
                <div>
                  <h3 className="text-h3" style={{ color: isActive ? 'var(--primary)' : (isPast ? 'var(--text-main)' : 'var(--text-muted)'), marginBottom: 'var(--space-4)', fontSize: '1.25rem' }}>
                    {stage}
                  </h3>
                  {isActive && (
                    <p className="text-body-sm text-secondary">
                      This step is currently in progress. Updates happen automatically.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--space-48)', textAlign: 'center' }}>
          <Link to={`/orders/${order._id}`} className="btn btn-outline btn-block">View Order Details</Link>
        </div>
      </div>
    </div>
  );
}