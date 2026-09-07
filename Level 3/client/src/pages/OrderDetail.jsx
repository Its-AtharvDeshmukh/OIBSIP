import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.data || data);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: 'var(--space-64) 0', textAlign: 'center' }}>Loading details...</div>;
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: 'var(--space-64) 0', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '400px', margin: '0 auto' }}>{error}</div>
        <button onClick={() => navigate('/orders')} className="btn btn-outline" style={{ marginTop: 'var(--space-24)' }}>Back to Orders</button>
      </div>
    );
  }

  // Safely extract populated data or fallback to raw IDs
  const getIngredientName = (ingredient) => {
    if (!ingredient) return 'None';
    return ingredient.name || 'Custom Ingredient';
  };

  return (
    <div className="container" style={{ padding: 'var(--space-48) var(--space-16)' }}>
      <button onClick={() => navigate('/orders')} className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-24)', display: 'inline-block' }}>
        ← Back to History
      </button>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-20)', marginBottom: 'var(--space-24)' }}>
          <div>
            <h1 className="text-h2" style={{ marginBottom: 'var(--space-4)' }}>Order Receipt</h1>
            <p className="text-body-sm text-secondary" style={{ fontFamily: 'monospace' }}>#{order._id}</p>
          </div>
          <span className="badge badge-primary">{order.status}</span>
        </div>

        <h3 className="text-h4" style={{ marginBottom: 'var(--space-16)' }}>Pizza Configuration</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-32)' }}>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-body-sm text-secondary">Base</span>
            <span className="text-body-sm" style={{ fontWeight: '500' }}>{getIngredientName(order.base)}</span>
          </li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-body-sm text-secondary">Sauce</span>
            <span className="text-body-sm" style={{ fontWeight: '500' }}>{getIngredientName(order.sauce)}</span>
          </li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-body-sm text-secondary">Cheese</span>
            <span className="text-body-sm" style={{ fontWeight: '500' }}>{getIngredientName(order.cheese)}</span>
          </li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-body-sm text-secondary">Vegetables</span>
            <span className="text-body-sm" style={{ fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>
              {order.veggies && order.veggies.length > 0 ? order.veggies.map(getIngredientName).join(', ') : 'None'}
            </span>
          </li>
        </ul>

        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-24)' }}>
          <h3 className="text-body-sm" style={{ fontWeight: '600', marginBottom: 'var(--space-8)' }}>Delivery Address</h3>
          <p className="text-body-sm text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
            {order.deliveryAddress || 'Address not provided'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed var(--border)', paddingTop: 'var(--space-24)', marginBottom: 'var(--space-32)' }}>
          <span className="text-h3">Total Paid</span>
          <span className="text-price" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{formatPrice(order.totalAmount || order.amount)}</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
          <Link to={`/track/${order._id}`} className="btn btn-primary btn-block">Track Live Status</Link>
        </div>
      </div>
    </div>
  );
}