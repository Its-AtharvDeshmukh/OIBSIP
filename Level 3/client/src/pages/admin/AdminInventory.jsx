import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [thresholdInput, setThresholdInput] = useState('');
  const toast = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Using admin-specific or standard inventory management endpoint per backend contract
      const { data } = await API.get('/inventory');
      setItems(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError('Failed to fetch inventory data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setStockInput(item.stock ?? item.quantity ?? 0);
    setThresholdInput(item.threshold ?? 5);
  };

  const handleSave = async (id) => {
    try {
      await API.put(`/admin/inventory/${id}`, {
        stock: Number(stockInput),
        threshold: Number(thresholdInput)
      });
      toast.addToast('Inventory updated successfully', 'success');
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to update stock', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0' }}>
      <style>{`
        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .inventory-table th, .inventory-table td {
          padding: var(--space-16) var(--space-24);
          border-bottom: 1px solid var(--border-light);
        }
        .inventory-table th {
          background: var(--bg-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .inventory-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-32)' }}>
        <div>
          <Link to="/admin/dashboard" className="text-body-sm text-secondary" style={{ display: 'inline-block', marginBottom: 'var(--space-8)' }}>
            ← Back to Admin Console
          </Link>
          <h1 className="text-h1">Inventory Control</h1>
        </div>
        <button onClick={fetchInventory} className="btn btn-outline btn-sm">Refresh Stock</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-64)' }}>Loading inventory records...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const stock = item.stock ?? item.quantity ?? 0;
                const threshold = item.threshold ?? 5;
                const isLowStock = stock <= threshold;
                const isEditing = editingItem === item._id;

                return (
                  <tr key={item._id}>
                    <td style={{ fontWeight: '600' }}>{item.name}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={stockInput} 
                          onChange={(e) => setStockInput(e.target.value)}
                          className="form-input"
                          style={{ width: '80px', padding: '4px 8px' }}
                        />
                      ) : (
                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>{stock}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={thresholdInput} 
                          onChange={(e) => setThresholdInput(e.target.value)}
                          className="form-input"
                          style={{ width: '80px', padding: '4px 8px' }}
                        />
                      ) : (
                        <span className="text-secondary">{threshold}</span>
                      )}
                    </td>
                    <td>
                      {isLowStock ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleSave(item._id)} className="btn btn-primary btn-sm">Save</button>
                          <button onClick={() => setEditingItem(null)} className="btn btn-outline btn-sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(item)} className="btn btn-outline btn-sm">Update Stock</button>
                      )}
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