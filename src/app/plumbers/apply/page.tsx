'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Wrench, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlumberApplyPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', license: '',
    services: '', areas: '', experience: '', bio: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/plumbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, experience: parseInt(form.experience) }),
      });
      if (!res.ok) throw new Error('Submission failed');
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
          <h2 style={{ marginBottom: '0.5rem' }}>Application Submitted! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your application is under review. You will be listed in our directory once approved by the municipal authority.
          </p>
          <Link href="/plumbers" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="hero" style={{ padding: '6rem 2rem 3rem' }}>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Wrench size={48} color="#06d6a0" style={{ marginBottom: '1rem' }} />
          <h1>Join Our <span className="gradient-text">Professional Network</span></h1>
          <p>Apply to be listed as a certified plumber on AquaTrack and serve your community.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 2rem 5rem' }}>
        <div className="container" style={{ maxWidth: 650 }}>
          <motion.form
            className="card"
            style={{ padding: '2.5rem' }}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Phone Number *</label>
                <input className="form-input" required value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
              </div>
              <div className="form-group">
                <label>License Number *</label>
                <input className="form-input" required value={form.license} onChange={e => update('license', e.target.value)} placeholder="PLB-XXXX-XXXX" />
              </div>
            </div>

            <div className="form-group">
              <label>Services Offered *</label>
              <input className="form-input" required value={form.services} onChange={e => update('services', e.target.value)} placeholder="Pipe Repair, Leak Detection, Drain Cleaning" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Service Areas *</label>
                <input className="form-input" required value={form.areas} onChange={e => update('areas', e.target.value)} placeholder="Downtown, Riverside Heights" />
              </div>
              <div className="form-group">
                <label>Years of Experience *</label>
                <input className="form-input" type="number" min="0" required value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="5" />
              </div>
            </div>

            <div className="form-group">
              <label>Short Bio</label>
              <textarea className="form-textarea" value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell us about your experience and specializations..." />
            </div>

            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
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
