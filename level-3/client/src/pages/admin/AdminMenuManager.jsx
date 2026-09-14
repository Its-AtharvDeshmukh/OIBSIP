import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

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
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const initialForm = {
    name: '', description: '', price: '', category: 'Signature',
    isAvailable: true, isFeatured: false, imageFile: null,
    base: 'Classic Hand Tossed', sauce: 'Marinara', cheese: 'Fresh Mozzarella'
  };
  
  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/menu');
      setPizzas(data.data || []);
    } catch (err) {
      toast.error('Failed to load menu catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('File exceeds 5MB limit.');
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = (pizza = null) => {
    if (pizza) {
      setEditingId(pizza._id);
      setFormData({
        name: pizza.name, description: pizza.description, price: pizza.price, category: pizza.category,
        isAvailable: pizza.isAvailable, isFeatured: pizza.isFeatured, imageFile: null,
        base: pizza.defaultConfig?.base || '', sauce: pizza.defaultConfig?.sauce || '', cheese: pizza.defaultConfig?.cheese || ''
      });
      setImagePreview(pizza.image);
    } else {
      setEditingId(null);
      setFormData(initialForm);
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile' && key !== 'base' && key !== 'sauce' && key !== 'cheese') {
          payload.append(key, formData[key]);
        }
      });
      payload.append('defaultConfig', JSON.stringify({ base: formData.base, sauce: formData.sauce, cheese: formData.cheese, veggies: [] }));
      if (formData.imageFile) payload.append('imageFile', formData.imageFile);

      if (editingId) {
        await API.put(`/admin/menu/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Pizza updated successfully.');
      } else {
        await API.post('/admin/menu', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('New pizza published.');
      }
      setShowModal(false);
      fetchMenu();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this pizza? Existing orders will remain unchanged.')) return;
    try {
      await API.delete(`/admin/menu/${id}`);
      toast.success('Pizza safely removed from menu.');
      fetchMenu();
    } catch (err) {
      toast.error('Failed to remove pizza.');
    }
  };

  const filteredPizzas = pizzas.filter(p => {
    if (filter === 'Available' && !p.isAvailable) return false;
    if (filter === 'Unavailable' && p.isAvailable) return false;
    if (filter === 'Featured' && !p.isFeatured) return false;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 className="text-h1">Menu Management</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Add Pizza</button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input type="text" placeholder="Search pizzas..." className="form-input" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        <select className="form-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: '150px' }}>
          <option>All</option><option>Available</option><option>Unavailable</option><option>Featured</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredPizzas.map(pizza => (
          <div key={pizza._id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: pizza.isAvailable ? 1 : 0.6 }}>
            <div style={{ position: 'relative', height: '160px', background: '#f1f5f9' }}>
              <img src={getImageUrl(pizza.image)} alt={pizza.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {pizza.isFeatured && <span className="badge badge-warning" style={{ position: 'absolute', top: 8, left: 8 }}>Featured</span>}
              {!pizza.isAvailable && <span className="badge badge-danger" style={{ position: 'absolute', top: 8, right: 8 }}>Unavailable</span>}
            </div>
            <div style={{ padding: '16px' }}>
              <h3 className="text-h4">{pizza.name}</h3>
              <p className="text-price">{formatPrice(pizza.price)}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => openModal(pizza)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Edit</button>
                <button onClick={() => handleDelete(pizza._id)} className="btn btn-outline btn-sm" style={{ color: 'red', borderColor: 'red' }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.6)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white', 
            width: '100%', 
            maxWidth: '600px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 className="text-h3" style={{ marginBottom: '24px' }}>{editingId ? 'Edit Pizza' : 'Add New Pizza'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '180px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', overflow: 'hidden', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>No image selected</p>
                  )}
                </div>
                <input type="file" ref={fileInputRef} accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-outline btn-sm">Upload Cloudinary Image</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Pizza Name</label>
                  <input className="form-input" placeholder="e.g. Margherita" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" placeholder="499" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="Describe the ingredients and flavor profile..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" required />
              </div>

              <div style={{ display: 'flex', gap: '24px', padding: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} /> Available to Order
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} /> Featured on Home
                </label>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>{submitting ? 'Saving...' : 'Save Pizza'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}