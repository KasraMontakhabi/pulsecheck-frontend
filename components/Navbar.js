'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
            <Activity size={24} style={{ marginRight: '8px', display: 'inline' }} />
            PulseCheck
          </Link>
          
          <div className="nav-links">
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link href="/monitors" className="nav-link">
                  Monitors
                </Link>
                <button
                  onClick={logout}
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">
                  Login
                </Link>
                <Link href="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}