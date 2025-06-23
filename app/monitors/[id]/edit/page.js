'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthProvider, useAuth } from '../../../../contexts/AuthContext';
import Navbar from '../../../../components/Navbar';
import { api } from '../../../../lib/api';
import { Edit, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

function EditMonitorForm() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    interval: 300,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [monitor, setMonitor] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchMonitor();
    }
  }, [isAuthenticated, id]);

  const fetchMonitor = async () => {
    try {
      const monitors = await api.getMonitors();
      const foundMonitor = monitors.find(m => m.id === id);
      
      if (!foundMonitor) {
        setError('Monitor not found');
        return;
      }

      setMonitor(foundMonitor);
      setFormData({
        url: foundMonitor.url,
        name: foundMonitor.name || '',
        interval: foundMonitor.interval,
        is_active: foundMonitor.is_active,
      });
    } catch (err) {
      setError('Failed to load monitor');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.updateMonitor(id, formData);
      router.push('/monitors');
    } catch (err) {
      setError(err.message || 'Failed to update monitor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'interval' ? parseInt(value) : value),
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
          <p className="card-subtitle">You need to be signed in to edit monitors.</p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Loading monitor...</p>
        </div>
      </div>
    );
  }

  if (error && !monitor) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Error</h2>
          <p className="card-subtitle">{error}</p>
          <Link href="/monitors" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Monitors
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
                <Edit size={28} style={{ marginRight: '8px', display: 'inline' }} />
                Edit Monitor
              </h1>
              <p className="card-subtitle" style={{ margin: 0 }}>
                Update your monitor settings
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
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                />
                <span className="form-label" style={{ margin: 0 }}>
                  Active Monitoring
                </span>
              </label>
              <small style={{ color: '#718096', fontSize: '14px' }}>
                Uncheck to pause monitoring for this service
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>

          {monitor && (
            <div style={{ 
              marginTop: '32px', 
              padding: '16px', 
              background: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#4a5568' }}>Monitor Status</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                <div>
                  <strong>Current Status:</strong>
                  <span className={`status status-${monitor.status}`} style={{ marginLeft: '8px' }}>
                    {monitor.status.toUpperCase()}
                  </span>
                </div>
                {monitor.last_latency_ms && (
                  <div>
                    <strong>Last Response:</strong> {monitor.last_latency_ms}ms
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditMonitorPage() {
  return (
    <AuthProvider>
      <Navbar />
      <EditMonitorForm />
    </AuthProvider>
  );
}