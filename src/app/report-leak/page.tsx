'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportLeakPage() {
  const [form, setForm] = useState({
    location: '', description: '', severity: 'medium',
    reporterName: '', reporterPhone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/leak-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <motion.div
          className="card"
          style={{ maxWidth: 500, textAlign: 'center', padding: '3rem' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <CheckCircle2 size={64} color="#06d6a0" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Report Submitted! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Thank you for reporting this leak. Our municipal team has been notified and will respond shortly.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="hero" style={{ padding: '6rem 2rem 3rem' }}>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.4))' }} />
          <h1>Report a <span style={{ color: '#ef4444' }}>Water Leak</span></h1>
          <p>Spotted a burst pipe or running water? Report it immediately to help prevent water waste.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 2rem 5rem' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <motion.form
            className="card"
            style={{ padding: '2.5rem' }}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Location *</label>
              <input className="form-input" required value={form.location} onChange={e => update('location', e.target.value)}
                placeholder="e.g. Corner of Moi Ave & Kenyatta Blvd, Downtown" />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-textarea" required value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Describe the leak (size, water flow, nearby landmarks)..." />
            </div>

            <div className="form-group">
              <label>Severity *</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { value: 'low', label: 'Low', desc: 'Small drip', color: '#06d6a0' },
                  { value: 'medium', label: 'Medium', desc: 'Steady flow', color: '#f59e0b' },
                  { value: 'high', label: 'High', desc: 'Strong flow', color: '#f97316' },
                  { value: 'critical', label: 'Critical', desc: 'Flooding', color: '#ef4444' },
                ].map(s => (
                  <motion.button
                    key={s.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => update('severity', s.value)}
                    style={{
                      flex: 1, minWidth: 100, padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                      background: form.severity === s.value ? `${s.color}20` : 'var(--bg-input)',
                      border: `1px solid ${form.severity === s.value ? s.color : 'var(--border)'}`,
                      color: form.severity === s.value ? s.color : 'var(--text-secondary)',
                      cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-family)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.label}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{s.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Your Name *</label>
                <input className="form-input" required value={form.reporterName} onChange={e => update('reporterName', e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input className="form-input" required value={form.reporterPhone} onChange={e => update('reporterPhone', e.target.value)} placeholder="+254 7XX XXX XXX" />
              </div>
            </div>

            <button type="submit" className="btn btn-danger btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Submitting...' : <><Send size={18} /> Submit Leak Report</>}
            </button>
          </motion.form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 AquaTrack. Built for a sustainable future. 💧</p>
      </footer>
    </div>
  );
}
