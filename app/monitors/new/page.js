'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../../components/Navbar';
import { api } from '../../../lib/api';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function NewMonitorForm() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    interval: 300,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createMonitor(formData);
      router.push('/monitors');
    } catch (err) {
      setError(err.message || 'Failed to create monitor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'interval' ? parseInt(value) : value,
    });
  };

  const intervalOptions = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Please Sign In</h2>
          <p className="card-subtitle">You need to be signed in to create monitors.</p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 200px)' 
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <Link 
              href="/monitors" 
              className="btn btn-secondary"
              style={{ marginRight: '16px', padding: '8px 12px' }}
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="card-title" style={{ margin: 0 }}>
                <Plus size={28} style={{ marginRight: '8px', display: 'inline' }} />
                Add New Monitor
              </h1>
              <p className="card-subtitle" style={{ margin: 0 }}>
                Start monitoring a new website or API endpoint
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="url" className="form-label">
                URL to Monitor *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com"
                required
              />
              <small style={{ color: '#718096', fontSize: '14px' }}>
                Enter the full URL including http:// or https://
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Monitor Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="My Website"
                maxLength={100}
              />
              <small style={{ color: '#718096', fontSize: '14px' }}>
                Optional: Give your monitor a friendly name for easier identification
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="interval" className="form-label">
                Check Interval *
              </label>
              <select
                id="interval"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                className="form-select"
                required
              >
                {intervalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small style={{ color: '#718096', fontSize: '14px' }}>
                How often should we check your website?
              </small>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginTop: '32px',
              justifyContent: 'flex-end'
            }}>
              <Link href="/monitors" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px' }} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Monitor
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={{ 
            marginTop: '32px', 
            padding: '16px', 
            background: '#f7fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#4a5568' }}>💡 Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#718096', fontSize: '14px' }}>
              <li>Use HTTPS URLs when possible for better security</li>
              <li>Shorter intervals provide faster alerts but use more resources</li>
              <li>You'll receive email alerts when your service goes down</li>
              <li>Monitor both your main site and critical API endpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewMonitorPage() {
  return (
    <AuthProvider>
      <Navbar />
      <NewMonitorForm />
    </AuthProvider>
  );
}