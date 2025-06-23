'use client';

import Link from 'next/link';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Activity, Shield, Zap, Bell } from 'lucide-react';

function HomeContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard-style home
  if (isAuthenticated) {
    return (
      <div className="container">
        {/* Welcome Back Section */}
        <div className="card" style={{ textAlign: 'center', marginTop: '48px' }}>
          <div className="card-header">
            <h1 className="card-title" style={{ fontSize: '48px', marginBottom: '16px' }}>
              <Activity size={48} style={{ marginRight: '16px', display: 'inline' }} />
              Welcome Back!
            </h1>
            <p className="card-subtitle" style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
              Ready to monitor your services? Check your dashboard or add new monitors to keep everything running smoothly.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Go to Dashboard
            </Link>
            <Link href="/monitors/new" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Add Monitor
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-3" style={{ marginTop: '64px' }}>
          <Link href="/dashboard" className="card" style={{ textAlign: 'center', textDecoration: 'none', transition: 'transform 0.2s' }}>
            <Activity size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
            <h3 className="card-title" style={{ fontSize: '20px' }}>Dashboard</h3>
            <p className="card-subtitle">
              View your monitoring overview and recent activity
            </p>
          </Link>

          <Link href="/monitors" className="card" style={{ textAlign: 'center', textDecoration: 'none', transition: 'transform 0.2s' }}>
            <Shield size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
            <h3 className="card-title" style={{ fontSize: '20px' }}>Monitors</h3>
            <p className="card-subtitle">
              Manage all your monitors and check their status
            </p>
          </Link>

          <Link href="/monitors/new" className="card" style={{ textAlign: 'center', textDecoration: 'none', transition: 'transform 0.2s' }}>
            <Zap size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
            <h3 className="card-title" style={{ fontSize: '20px' }}>Add Monitor</h3>
            <p className="card-subtitle">
              Start monitoring a new website or API endpoint
            </p>
          </Link>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="card" style={{ textAlign: 'center', marginTop: '48px' }}>
        <div className="card-header">
          <h1 className="card-title" style={{ fontSize: '48px', marginBottom: '16px' }}>
            <Activity size={48} style={{ marginRight: '16px', display: 'inline' }} />
            PulseCheck
          </h1>
          <p className="card-subtitle" style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
            Monitor your websites and APIs with real-time uptime tracking, instant notifications, and beautiful dashboards.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            Get Started Free
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-3" style={{ marginTop: '64px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Zap size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
          <h3 className="card-title" style={{ fontSize: '20px' }}>Real-time Monitoring</h3>
          <p className="card-subtitle">
            Check your websites every 30 seconds with instant status updates via WebSocket connections.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <Bell size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
          <h3 className="card-title" style={{ fontSize: '20px' }}>Smart Alerts</h3>
          <p className="card-subtitle">
            Get instant email notifications when your services go down with smart debouncing to prevent spam.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <Shield size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
          <h3 className="card-title" style={{ fontSize: '20px' }}>Reliable & Secure</h3>
          <p className="card-subtitle">
            Built with FastAPI and PostgreSQL for enterprise-grade reliability and security.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="card" style={{ marginTop: '64px', textAlign: 'center' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ fontSize: '32px' }}>Simple, Powerful Monitoring</h2>
          <p className="card-subtitle" style={{ fontSize: '18px' }}>
            Everything you need to keep your services online
          </p>
        </div>
        
        <div className="grid grid-3">
          <div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>30s</div>
            <div style={{ fontSize: '18px', color: '#718096' }}>Check Interval</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>99.9%</div>
            <div style={{ fontSize: '18px', color: '#718096' }}>Uptime Target</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>&lt;1s</div>
            <div style={{ fontSize: '18px', color: '#718096' }}>Alert Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <Navbar />
      <HomeContent />
    </AuthProvider>
  );
}