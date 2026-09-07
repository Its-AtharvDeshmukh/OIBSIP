import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper to resolve relative backend image paths (e.g., /images/pizza.jpg -> http://localhost:5001/images/pizza.jpg)
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
  return `${backendBase}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function AdminMenuManager() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    price: '', 
    image: '',
    base: 'Classic Hand Tossed', 
    sauce: 'Marinara', 
    cheese: 'Fresh Mozzarella'
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/pizzas');
      setPizzas(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError('Failed to load menu catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMenu(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this pizza from the live menu?')) return;
    try {
      await API.delete(`/pizzas/${id}`);
      setPizzas(pizzas.filter(p => p._id !== id));
      setSuccessMsg('Pizza successfully removed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddPizza = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        defaultConfig: {
          base: formData.base,
          sauce: formData.sauce,
          cheese: formData.cheese,
          veggies: []
        }
      };
      const { data } = await API.post('/pizzas', payload);
      const newPizza = data.data || data;
      setPizzas([...pizzas, newPizza]);
      setFormData({ 
        name: '', description: '', price: '', image: '', 
        base: 'Classic Hand Tossed', sauce: 'Marinara', cheese: 'Fresh Mozzarella' 
      });
      setSuccessMsg('New artisan pizza published to the live menu!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish pizza');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-80) 0', textAlign: 'center' }}>
        <p className="text-body text-secondary">Loading admin menu console...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-40) var(--space-16) var(--space-80) var(--space-16)' }}>
      <style>{`
        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-16);
        }
        @media (min-width: 768px) {
          .admin-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .span-two {
            grid-column: span 2;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-32)' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-8)' }}>Admin Console</span>
          <h1 className="text-display">Menu Catalog Manager</h1>
        </div>
        <a href="/admin/orders" className="btn btn-outline btn-sm">Manage Orders →</a>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-24)' }}>{error}</div>}
      {successMsg && <div className="alert alert-success" style={{ marginBottom: 'var(--space-24)', backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>{successMsg}</div>}
      
      {/* Add New Pizza Form Card */}
      <div className="card" style={{ marginBottom: 'var(--space-48)', padding: 'var(--space-32)' }}>
        <h2 className="text-h3" style={{ marginBottom: 'var(--space-20)' }}>Publish New Pizza Recipe</h2>
        
        <form onSubmit={handleAddPizza} className="admin-form-grid">
          <div>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Pizza Name</label>
            <input className="form-input" placeholder="e.g. Truffle Mushroom Artisan" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Price (₹)</label>
            <input className="form-input" type="number" placeholder="e.g. 449" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          </div>

          <div className="span-two">
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Image URL</label>
            <input className="form-input" placeholder="https://images.unsplash.com/photo-..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
            <span className="text-caption text-secondary" style={{ display: 'block', marginTop: '4px' }}>
              💡 Tip: Use any direct image link (e.g. Unsplash image address).
            </span>
          </div>

          <div className="span-two">
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Mouth-watering Description</label>
            <textarea className="form-input" placeholder="Rich truffle cream, roasted wild mushrooms, fresh rosemary..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ minHeight: '90px' }} required />
          </div>
          
          <div>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Default Base</label>
            <input className="form-input" value={formData.base} onChange={(e) => setFormData({...formData, base: e.target.value})} required />
          </div>
          
          <div>
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Default Sauce</label>
            <input className="form-input" value={formData.sauce} onChange={(e) => setFormData({...formData, sauce: e.target.value})} required />
          </div>
          
          <div className="span-two">
            <label className="text-body-sm" style={{ display: 'block', marginBottom: 'var(--space-8)', fontWeight: '600' }}>Default Cheese</label>
            <input className="form-input" value={formData.cheese} onChange={(e) => setFormData({...formData, cheese: e.target.value})} required />
          </div>
          
          <div className="span-two" style={{ marginTop: 'var(--space-12)' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-block" style={{ padding: 'var(--space-16)', fontWeight: '700' }}>
              {submitting ? 'Publishing...' : 'Publish to Live Menu'}
            </button>
          </div>
        </form>
      </div>

      {/* Live Menu Grid */}
      <div style={{ marginBottom: 'var(--space-24)' }}>
        <h2 className="text-h2" style={{ marginBottom: 'var(--space-20)' }}>Current Menu Catalog ({pizzas.length})</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-24)' }}>
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '180px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <img 
                src={getImageUrl(pizza.image)} 
                alt={pizza.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { 
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'var(--border-light)';
                }}
              />
            </div>
            <div style={{ padding: 'var(--space-20)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                <h3 className="text-h4">{pizza.name}</h3>
                <span className="text-price" style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatPrice(pizza.price)}</span>
              </div>
              <p className="text-body-sm text-secondary" style={{ marginBottom: 'var(--space-20)', flexGrow: 1 }}>{pizza.description}</p>
              <button 
                onClick={() => handleDelete(pizza._id)} 
                className="btn btn-outline btn-block" 
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
              >
                Remove from Menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}