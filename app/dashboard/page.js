'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { api } from '../../lib/api';
import { Activity, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { isAuthenticated } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    up: 0,
    down: 0,
    unknown: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchMonitors();
    }
  }, [isAuthenticated]);

  const fetchMonitors = async () => {
    try {
      const data = await api.getMonitors();
      setMonitors(data);
      
      // Calculate stats
      const stats = data.reduce(
        (acc, monitor) => {
          acc.total++;
          acc[monitor.status]++;
          return acc;
        },
        { total: 0, up: 0, down: 0, unknown: 0 }
      );
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircle size={20} />;
      case 'down':
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const formatLastChecked = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Please Sign In</h2>
          <p className="card-subtitle">You need to be signed in to access the dashboard.</p>
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
          <p style={{ marginTop: '16px' }}>Loading dashboard...</p>
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
              <Activity size={32} style={{ marginRight: '12px', display: 'inline' }} />
              Dashboard
            </h1>
            <p className="card-subtitle">Monitor your services at a glance</p>
          </div>
          <Link href="/monitors/new" className="btn btn-primary">
            <Plus size={20} />
            Add Monitor
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: '#667eea', 
              borderRadius: '12px', 
              padding: '12px', 
              color: 'white' 
            }}>
              <Activity size={24} />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.total}
              </div>
              <div style={{ color: '#718096' }}>Total Monitors</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: '#48bb78', 
              borderRadius: '12px', 
              padding: '12px', 
              color: 'white' 
            }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.up}
              </div>
              <div style={{ color: '#718096' }}>Services Up</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: '#f56565', 
              borderRadius: '12px', 
              padding: '12px', 
              color: 'white' 
            }}>
              <XCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.down}
              </div>
              <div style={{ color: '#718096' }}>Services Down</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: '#ed8936', 
              borderRadius: '12px', 
              padding: '12px', 
              color: 'white' 
            }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.unknown}
              </div>
              <div style={{ color: '#718096' }}>Unknown Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitors List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
          <p className="card-subtitle">Latest status updates from your monitors</p>
        </div>

        {monitors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Activity size={48} style={{ color: '#cbd5e0', marginBottom: '16px' }} />
            <h3 style={{ color: '#4a5568', marginBottom: '8px' }}>No monitors yet</h3>
            <p style={{ color: '#718096', marginBottom: '24px' }}>
              Get started by adding your first monitor
            </p>
            <Link href="/monitors/new" className="btn btn-primary">
              <Plus size={20} />
              Add Your First Monitor
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {monitors.slice(0, 5).map((monitor) => (
              <div
                key={monitor.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f7fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`status status-${monitor.status}`}>
                    {getStatusIcon(monitor.status)}
                    {monitor.status.toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2d3748' }}>
                      {monitor.name || monitor.url}
                    </div>
                    <div style={{ color: '#718096', fontSize: '14px' }}>
                      {monitor.url}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#718096', fontSize: '14px' }}>
                  <div>
                    {monitor.last_latency_ms ? `${monitor.last_latency_ms}ms` : 'N/A'}
                  </div>
                  <div>{formatLastChecked(monitor.last_checked_at)}</div>
                </div>
              </div>
            ))}
            
            {monitors.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link href="/monitors" className="btn btn-secondary">
                  View All Monitors
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Navbar />
      <DashboardContent />
    </AuthProvider>
  );
}