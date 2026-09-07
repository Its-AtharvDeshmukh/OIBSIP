import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const PizzaSliceIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-16)' }}>
    <path d="M14.54 3.23a2.04 2.04 0 0 0-3.08 0L2.14 14.1a2 2 0 0 0 1.54 3.33H20.3a2 2 0 0 0 1.54-3.33L14.54 3.23z"/>
    <path d="M11 9h.01"/><path d="M15 12h.01"/><path d="M9 13h.01"/>
  </svg>
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        // Handle varying backend wrappers
        setOrders(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError('Failed to load your order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivery')) return 'badge-success';
    if (s.includes('kitchen')) return 'badge-warning';
    return 'badge-primary';
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-64) 0' }}>
        <h1 className="text-h1" style={{ marginBottom: 'var(--space-32)' }}>My Orders</h1>
        <div style={{ display: 'grid', gap: 'var(--space-16)' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card" style={{ height: '120px', background: 'var(--bg-secondary)', border: 'none', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0' }}>
      <h1 className="text-h1" style={{ marginBottom: 'var(--space-32)' }}>My Orders</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-64) var(--space-20)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PizzaSliceIcon />
          <h2 className="text-h3" style={{ marginBottom: 'var(--space-8)' }}>No orders yet</h2>
          <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-24)', maxWidth: '400px' }}>
            It looks like you haven't crafted your first pizza yet. Head over to the builder to get started!
          </p>
          <Link to="/builder" className="btn btn-primary">Build Custom Pizza</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-24)' }}>
          {orders.map(order => (
            <div key={order._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-4)' }}>
                    <span className="text-h4">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                  </div>
                  <p className="text-caption text-secondary">{formatDate(order.createdAt)}</p>
                </div>
                <span className="text-price">{formatPrice(order.totalAmount || order.amount)}</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-16)' }}>
                <Link to={`/track/${order._id}`} className="btn btn-primary btn-sm">Track Status</Link>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}