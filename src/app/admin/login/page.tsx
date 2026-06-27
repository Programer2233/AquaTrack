'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Droplets, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }
      // Store token in localStorage
      localStorage.setItem('aquatrack_admin', JSON.stringify(data));
      router.push('/admin/dashboard');
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="water-bg">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="drop" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,214,160,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', border: '1px solid var(--border)',
            }}>
              <Shield size={32} color="#0ea5e9" />
            </div>
          </motion.div>
          <h1 style={{ fontSize: '1.5rem' }}>
            <Droplets size={20} color="#0ea5e9" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            AquaTrack Admin
          </h1>
          <p>Government Water Management Portal</p>
        </div>

        {error && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Demo: username <strong>admin</strong> / password <strong>aquatrack2026</strong>
        </p>
      </motion.div>
    </div>
  );
}
