'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { api } from '../../lib/api';
import { 
  Monitor, 
  Plus, 
  Edit, 
  Trash2, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

function MonitorsContent() {
  const { isAuthenticated } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMonitors();
    }
  }, [isAuthenticated]);

  const fetchMonitors = async () => {
    try {
      const data = await api.getMonitors();
      setMonitors(data);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this monitor?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteMonitor(id);
      setMonitors(monitors.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete monitor:', error);
      alert('Failed to delete monitor');
    } finally {
      setDeletingId(null);
    }
  };

  const handleManualCheck = async (id) => {
    setCheckingId(id);
    try {
      const updatedMonitor = await api.checkMonitor(id);
      setMonitors(monitors.map(m => m.id === id ? updatedMonitor : m));
    } catch (error) {
      console.error('Failed to check monitor:', error);
      alert('Failed to check monitor');
    } finally {
      setCheckingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircle size={20} style={{ color: '#48bb78' }} />;
      case 'down':
        return <XCircle size={20} style={{ color: '#f56565' }} />;
      default:
        return <Clock size={20} style={{ color: '#ed8936' }} />;
    }
  };

  const formatLastChecked = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const formatInterval = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Please Sign In</h2>
          <p className="card-subtitle">You need to be signed in to manage monitors.</p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Loading monitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="card-title">
              <Monitor size={32} style={{ marginRight: '12px', display: 'inline' }} />
              Monitors
            </h1>
            <p className="card-subtitle">Manage and monitor your services</p>
          </div>
          <Link href="/monitors/new" className="btn btn-primary">
            <Plus size={20} />
            Add Monitor
          </Link>
        </div>
      </div>

      {/* Monitors List */}
      {monitors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <Monitor size={64} style={{ color: '#cbd5e0', marginBottom: '24px' }} />
          <h2 style={{ color: '#4a5568', marginBottom: '16px' }}>No monitors yet</h2>
          <p style={{ color: '#718096', marginBottom: '32px', fontSize: '18px' }}>
            Start monitoring your websites and APIs by creating your first monitor.
          </p>
          <Link href="/monitors/new" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            <Plus size={24} />
            Create Your First Monitor
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {monitors.map((monitor) => (
            <div key={monitor.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  {getStatusIcon(monitor.status)}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <h3 style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>
                        {monitor.name || 'Unnamed Monitor'}
                      </h3>
                      <span className={`status status-${monitor.status}`}>
                        {monitor.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '14px' }}>
                      <a 
                        href={monitor.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#667eea', 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {monitor.url}
                        <ExternalLink size={14} />
                      </a>
                      <span>•</span>
                      <span>Check every {formatInterval(monitor.interval)}</span>
                      {monitor.last_latency_ms && (
                        <>
                          <span>•</span>
                          <span>{monitor.last_latency_ms}ms</span>
                        </>
                      )}
                    </div>
                    <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '4px' }}>
                      Last checked: {formatLastChecked(monitor.last_checked_at)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleManualCheck(monitor.id)}
                    className="btn btn-secondary"
                    disabled={checkingId === monitor.id}
                    style={{ padding: '8px 12px' }}
                  >
                    {checkingId === monitor.id ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <PlayCircle size={16} />
                    )}
                  </button>
                  
                  <Link 
                    href={`/monitors/${monitor.id}/edit`}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px' }}
                  >
                    <Edit size={16} />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(monitor.id)}
                    className="btn btn-danger"
                    disabled={deletingId === monitor.id}
                    style={{ padding: '8px 12px' }}
                  >
                    {deletingId === monitor.id ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MonitorsPage() {
  return (
    <AuthProvider>
      <Navbar />
      <MonitorsContent />
    </AuthProvider>
  );
}