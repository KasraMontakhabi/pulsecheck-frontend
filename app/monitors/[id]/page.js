'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../../components/Navbar';
import { api } from '../../../lib/api';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { 
  Monitor, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  PlayCircle,
  ExternalLink,
  ArrowLeft,
  Activity
} from 'lucide-react';
import Link from 'next/link';

function MonitorDetailContent() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // WebSocket connection for real-time updates
  const wsUrl = monitor ? `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/api/v1/ws/${id}` : null;
  
  const { lastMessage } = useWebSocket(wsUrl, {
    shouldReconnect: true,
    onMessage: (data) => {
      console.log('Received WebSocket message:', data);
      if (data.type === 'status_update' && data.monitor_id === id) {
        setMonitor(prev => prev ? {
          ...prev,
          status: data.status,
          last_latency_ms: data.latency_ms,
          last_checked_at: data.checked_at,
        } : null);
      }
    },
  });

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
    } catch (err) {
      setError('Failed to load monitor');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    setChecking(true);
    try {
      const updatedMonitor = await api.checkMonitor(id);
      setMonitor(updatedMonitor);
    } catch (error) {
      console.error('Failed to check monitor:', error);
      alert('Failed to check monitor');
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircle size={24} style={{ color: '#48bb78' }} />;
      case 'down':
        return <XCircle size={24} style={{ color: '#f56565' }} />;
      default:
        return <Clock size={24} style={{ color: '#ed8936' }} />;
    }
  };

  const formatLastChecked = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatInterval = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  const formatUptime = () => {
    if (!monitor || !monitor.created_at) return 'N/A';
    
    const created = new Date(monitor.created_at);
    const now = new Date();
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours} hours`;
    const days = Math.floor(diffInHours / 24);
    return `${days} days`;
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Please Sign In</h2>
          <p className="card-subtitle">You need to be signed in to view monitor details.</p>
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
          <p style={{ marginTop: '16px' }}>Loading monitor details...</p>
        </div>
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Error</h2>
          <p className="card-subtitle">{error || 'Monitor not found'}</p>
          <Link href="/monitors" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Monitors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Link 
            href="/monitors" 
            className="btn btn-secondary"
            style={{ marginRight: '16px', padding: '8px 12px' }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 className="card-title" style={{ margin: 0 }}>
              <Monitor size={32} style={{ marginRight: '12px', display: 'inline' }} />
              {monitor.name || 'Unnamed Monitor'}
            </h1>
            <p className="card-subtitle" style={{ margin: 0 }}>
              Monitor details and real-time status
            </p>
          </div>
          <Link href={`/monitors/${id}/edit`} className="btn btn-secondary">
            <Edit size={16} />
            Edit
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {getStatusIcon(monitor.status)}
          <div>
            <span className={`status status-${monitor.status}`} style={{ fontSize: '16px' }}>
              {monitor.status.toUpperCase()}
            </span>
            <div style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
              Last checked: {formatLastChecked(monitor.last_checked_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: '#667eea' }} />
            Performance
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#718096' }}>Response Time:</span>
            <span style={{ fontWeight: '600' }}>
              {monitor.last_latency_ms ? `${monitor.last_latency_ms}ms` : 'N/A'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#718096' }}>Check Interval:</span>
            <span style={{ fontWeight: '600' }}>{formatInterval(monitor.interval)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#718096' }}>Monitoring Since:</span>
            <span style={{ fontWeight: '600' }}>{formatUptime()}</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={20} style={{ color: '#667eea' }} />
            Endpoint Details
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '4px' }}>URL:</div>
            <a 
              href={monitor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '500',
                wordBreak: 'break-all'
              }}
            >
              {monitor.url}
            </a>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '4px' }}>Status:</div>
            <span style={{ fontWeight: '600' }}>
              {monitor.is_active ? 'Active' : 'Paused'}
            </span>
          </div>
          <button
            onClick={handleManualCheck}
            className="btn btn-primary"
            disabled={checking}
            style={{ width: '100%' }}
          >
            {checking ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
                Checking...
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                Check Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px 0' }}>Real-time Updates</h3>
        <div style={{ 
          padding: '16px', 
          background: '#f7fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: lastMessage ? '#48bb78' : '#cbd5e0',
              animation: lastMessage ? 'pulse 2s infinite' : 'none'
            }}></div>
            <span style={{ fontSize: '14px', color: '#4a5568' }}>
              {lastMessage ? 'Connected to real-time updates' : 'Connecting...'}
            </span>
          </div>
          {lastMessage && (
            <div style={{ fontSize: '12px', color: '#718096' }}>
              Last update: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default function MonitorDetailPage() {
  return (
    <AuthProvider>
      <Navbar />
      <MonitorDetailContent />
    </AuthProvider>
  );
}