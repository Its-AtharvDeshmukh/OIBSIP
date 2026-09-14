import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/students');
      setStudents(data.data || []);
    } catch (err) {
      setError('Failed to fetch student records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await API.patch(`/admin/students/${id}/status`, { isActive: !currentStatus });
      toast.success(`Account ${!currentStatus ? 'activated' : 'suspended'}.`);
      setStudents(students.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update account status.');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await API.post('/admin/students', formData);
      toast.success('Student account created. Verification email sent.');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe filtering that won't crash if name or email is undefined
  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: 'var(--space-48) 0 var(--space-80) 0', position: 'relative' }}>
      <style>{`
        .table-responsive { width: 100%; overflow-x: auto; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 600px; }
        .data-table th, .data-table td { padding: var(--space-16) var(--space-20); border-bottom: 1px solid var(--border-light); }
        .data-table th { background: var(--bg-secondary); font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.05em; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: var(--z-modal); }
        .modal-content { background: var(--surface); width: 100%; maxWidth: 440px; border-radius: var(--radius-lg); padding: var(--space-32); box-shadow: var(--shadow-lg); }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-32)' }}>
        <div>
          <Link to="/admin/dashboard" className="text-body-sm text-secondary" style={{ display: 'inline-flex', marginBottom: 'var(--space-12)', fontWeight: '600' }}>← Back to Console</Link>
          <h1 className="text-h1">Student Management</h1>
          <p className="text-body-sm text-secondary" style={{ marginTop: '8px' }}>Create and manage student accounts securely.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add Student
        </button>
      </div>

      <div style={{ marginBottom: 'var(--space-24)' }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="form-input" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-48)' }}>Loading student records...</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration Date</th>
                <th>Verification</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-32)' }}>No students found.</td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <span className="text-body" style={{ fontWeight: '600', display: 'block' }}>{student.name}</span>
                    <span className="text-caption text-secondary">{student.email}</span>
                  </td>
                  <td><span className="text-body-sm">{new Date(student.createdAt).toLocaleDateString()}</span></td>
                  <td>
                    <span className={`badge ${student.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {student.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {student.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleStatusToggle(student._id, student.isActive)}
                      className="btn btn-outline btn-sm"
                      style={{ color: student.isActive ? 'var(--danger)' : 'var(--success)' }}
                    >
                      {student.isActive ? 'Suspend Access' : 'Activate Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Student Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-h3" style={{ marginBottom: 'var(--space-20)' }}>Register New Student</h2>
            <form onSubmit={handleCreateStudent}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input required type="password" minLength={6} className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-24)' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}