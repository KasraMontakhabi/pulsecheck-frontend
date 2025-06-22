'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { LogIn, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 200px)' 
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-header" style={{ textAlign: 'center' }}>
            <LogIn size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-subtitle">Sign in to your PulseCheck account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  style={{ paddingRight: '48px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: '#718096' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#667eea', fontWeight: '500' }}>
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Navbar />
      <LoginForm />
    </AuthProvider>
  );
}