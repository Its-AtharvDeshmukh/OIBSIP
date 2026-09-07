import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const STATUS_FLOW = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/orders');
      setOrders(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError('Failed to fetch incoming orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.addToast(`Order status updated to: ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivery')) return 'badge-success';
    if (s.includes('kitchen')) return 'badge-warning';
    return 'badge-primary';
  };

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0' }}>
      <style>{`
        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .orders-table th, .orders-table td {
          padding: var(--space-16) var(--space-24);
          border-bottom: 1px solid var(--border-light);
        }
        .orders-table th {
          background: var(--bg-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .orders-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-32)' }}>
        <div>
          <Link to="/admin/dashboard" className="text-body-sm text-secondary" style={{ display: 'inline-block', marginBottom: 'var(--space-8)' }}>
            ← Back to Admin Console
          </Link>
          <h1 className="text-h1">Order Management</h1>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline btn-sm">Refresh Orders</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-64)' }}>Loading customer orders...</div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-64)' }}>
          <p className="text-body text-secondary">No customer orders found in the system.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer / Address</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions / Progress Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>#{order._id.slice(-6).toUpperCase()}</span>
                      <p className="text-caption text-secondary">{formatDate(order.createdAt)}</p>
                    </td>
                    <td>
                      <p className="text-body-sm" style={{ fontWeight: '500' }}>{order.user?.name || 'Customer'}</p>
                      <p className="text-caption text-secondary" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.deliveryAddress || 'No address provided'}
                      </p>
                    </td>
                    <td>
                      <span className="text-price">{formatPrice(order.totalAmount || order.amount)}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {STATUS_FLOW.map((stage) => {
                          const isCurrent = order.status?.toLowerCase() === stage.toLowerCase();
                          return (
                            <button
                              key={stage}
                              onClick={() => handleStatusUpdate(order._id, stage)}
                              disabled={isCurrent}
                              className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                              {stage}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}